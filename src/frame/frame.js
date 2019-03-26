// Frame - similar to pandas in python
// import {arrayEqual, arrayMax, arrayTally, arrToCol, arrayTally, arrayTallySorted, arrayUniq, Frame} from './frame';
// jshint undef:true
// jshint unused:true

//import { getFreq } from './frequency';
import { createAccesClass } from './frame_element';
import { dataSplit } from '../string/csv';
import sortFrameBy from './sortframe';
import {groupBy} from './groupby';
import {frameWithIndex} from './frame-utils';
import haveFrame from './haveFrame';
import { flatten, arrRemove, arrDedup, arrEqual, newArray, vecAdd, arrHash} from '../array';
import { isA } from '../utils/objutils';
import {EMPTY_ARRAY} from '../utils/constants';
import {innerJoin, leftJoin, outerJoin} from './join-utils';


export function arrayEqual(a,b, eq) {
	if( a === undefined || b === undefined) return false;
	if( a === b ) return true;
	if( a.length !== b.length ) return false;
	if( eq ) {
		for(let i= 0; i< a.length; i++ ) if( !eq(a[i],b[i] ) ) return false;
	}
	else {
		for(let i= 0; i< a.length; i++ ) if( a[i] !== b[i] ) return false;
	}
	return true;
}


function isString(aStr) { return typeof aStr === 'string'; }
function isFunc(f) { return typeof f === 'function'; }
function isNum(v) {
	let nv = +v;
	if(isNaN(nv)) {
		return false;
	}
	return true;
}

function strCmp(a,b) {
	if(a === b) return 0;
	return a<b?-1:1;
}
const cmpStrBy = (colIX) => (row1,row2) => (strCmp(row1[colIX],row2[colIX]));


/**
 * [arrToCol description]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
export function arrToCol(arr) {
	return arr.map(x => [x] );
}



// *
//  * [description]
//  * @param  {[type]} list [description]
//  * @return {[type]}      [description]
 
// export const arrayTallySorted = (list) => arrayTally(list);//.sort( (a,b) => a.count < b.count);

/**
 * [description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
export const arrayUniq = (list)  => Object.keys(_makeUnique(list)).sort();



const EMPTY_STR = '';
function _makeUnique(listOfRows,colIx) {

	let dict = {};
	if( colIx === undefined) {
		let list = listOfRows; // the list just has data
		let len = list.length;
		for(let i = 0; i<len;i++) { 
			let row = list[i];
			let rlen = row.length;
			for(let k=0; k< rlen; k++){
				let x = row[k];
				if( typeof x === 'string' || x === undefined) {
					x = x===undefined ? EMPTY_STR :x;
					let nv = dict[x];
					if(nv === undefined) dict[v] = nv = x;
					row[k] = nv;
				}
			}
		} 
	}
	else {
		let len = listOfRows.length;
		let cnt = len<5000? len: Math.max(5000, Math.trunc(len/3));
		for(let i = 0; i<len;i++) {
			let row = listOfRows[i];
			let v = row[colIx];
			if( v === undefined || typeof v === 'string'  ) {
				if( !v ) {
					row[colIx] = EMPTY_STR;
				} else {
					let nv = dict[v];
					if(nv === undefined && cnt-- > 0) dict[v] = nv = v;
					else nv = v;
					row[colIx] = nv;
				}
			}
		} 
	}
	return dict;
}

function colorDefault(r,i) {
	switch(r.RULE_TYPE) {
	case 'TRIGGER': return (i & 1) ?'#b0ffb0':'lightgreen';
	case 'ENABLER': return 'skyblue';
	case 'POTENTIAL_INCLUSION': return (i & 1) ? '#fbd3da' :'#ffcdd5';
	}
	return (i & 1) ? 'white' :'#fffaff';		
}

/**
 * 
 */
export class Frame {
	/**
	 * [constructor description]
	 * @param  {[type]} data    [description]
	 * @param  {[type]} columns [description]
	 * @param  {[type]} name    [description]
	 * @param  {[type]} keyFunc [description]
	 * @return {[type]}         [description]
	 */
	constructor(data,columns,name,keyFunc) {
		name = name || '';
		this.keyFunc = keyFunc || this._getKey;
		this.data = data||[];
		this._columns = columns||[];
		this._name = name;
		this._unique = undefined;
		this._sortCols = EMPTY_ARRAY;
		this._row = undefined;
		this.AccessClass = columns?createAccesClass(this._columns):undefined;
		this.showLen = 400;
		this.rowColor = colorDefault;
		this._hash = -1;
	}

	/**
	 * Create a new frame based of this frame but with new data
	 * @param {[[string]]} d    new data for the frame (but with the same columns
	 * @param {String} name optional ne name
	 */
	setData(d,name) {
		return new Frame(d, this.columns, name || this.name, this.keyFunc);
	}

	_getKey(i) {
		return this.data[i][0];
	}

	/**
	 * [sort description]
	 * @param  {[type]} colNames [description]
	 * @param  {[type]} cmpFn    [description]
	 * @return {[type]}          [description]
	 */
	sort(colNames,cmpFn) { // the cmpFn is optional
		return sortFrameBy(colNames,this,cmpFn);
	}

	/**
	 * [getKey description]
	 * @param  {[type]} i [description]
	 * @return {[type]}   [description]
	 */
	getKey(i) {
		return this.keyFunc(i);
	}

	/**
	 * [columns description]
	 * @return {[type]} [description]
	 */
	get columns() { return this._columns||EMPTY_ARRAY; }
	set columns(columns) {
		return new Frame(this.data, this.columns, this.name, this.keyFunc);
	}
	get length() { return (this.data || EMPTY_ARRAY).length; }
	get name() { return this._name; }
	set name(aName) {
		return new Frame(this.data, this.columns, aName, this.keyFunc);
	}
	get unique() {
		if(this._unique === undefined) {
			this.makeUnique();
		}
		return this._unique;
	}

	get hash() {
		if( this._hash !== -1 ) return this._hash;
		return this._hash = this.data.reduce((h,arr) => (h*17|0)+arrHash(arr), 0);
	}

	get rows() { 
		if(this._rows === undefined) 
			this._rows = this.data.map(r => this._rowObj(r));
		return this._rows; 
	}


	equal(aFrame) {
		if(!aFrame) return false;
		if(this === aFrame) return true;
		if(this.length !== aFrame.length ) return false;
		if(!arrEqual(this.columns, aFrame.columns)) return false;
		let len = this.length;
		let d1 = this.data, d2 = aFrame.data;
		for(let i=0; i<len; i++) {
			let a1 = d1[i], a2 = d2[i];
			if( a1 === a2 ) continue;
			let ln = a1.length;
			if( ln !== a2.length ) return false;
			
			for(let j=0; j<ln; j++) {
				if( a1[j] !== a2[j]) return false;
			}
		}
		return true;
	}
	/**
	 * [colIx description]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	colIx(name) {
		return this._columns.indexOf(name);
	}

	/**
	 * make all the data elements unique
	 * @param  {[type]} retain [description]
	 * @return {[type]}        [description]
	 */
	makeUnique(retain) {
		if(this._unique) return this;
		let len = this.columns.length;
		let columns = this.columns, data = this.data;
		let res = {};
		for(let i=0; i<len; i++) {
			res[columns[i]] = Object.keys(_makeUnique(data, i)).sort();
		}
		this._unique = retain?res:true;
		return this;
	}


	/**
	 * 
	 *   colsMapping can be a 
	 *   		1. rearranged list of col names from the frame e.g [ 'B', 'A', 'F']
	 *   		2. or rearranged list of col names ['oldName=newName', ...] if =t of the
	 *   		   = is not there the col name does not change
	 *   example of usage:
	 *   list - Frame with list.data:
	 *
	 *			   [ [ 'jan', 'mon', 1, 2 ],
	 *				 [ 'jan', 'tue', 2, 6 ],
	 *				 [ 'jan', 'wed', 3, 4 ],
	 *				 [ 'jan', 'thu', undefined, 1 ],
	 *				 ...
	 *
	 *
	 *			  list.columns: [ 'mon', 'weekday', 'v1', 'v2' ],
	 *
	 *	add column 'nurul' with value 123, change 'weekday' to uppercase, 'v1' conver undefined to 0		  
	 *			
	 *			// Note the names if mapper are the new column names
	 *			var mapper = {
	 *				 nurul: (v,i,row, rowObj) => "123",
	 *				 weekday: (v) => v.toUpperCase(),
	 *				 v1: (v) => v===undefined?0:v
	 *			};
	 *
	 *			list.project([ 'mon', 'weekday','nurul' , 'v1', 'v2' ], mapper);
	 *
	 *	result:
	 *	
	 *			 [ 	[ 'jan', 'MON', '123', 1, 2 ],
	 *				[ 'jan', 'TUE', '123', 2, 6 ],
	 *				[ 'jan', 'WED', '123', 3, 4 ],
	 *				  'jan', 'THU', '123', 0, 1 ],
	 *				...
	 *
	 *    another expample:
	 *    
	 *            // Note the use. of the now column names
	 *            var mapper1 = {
	 *			     nurul: (v,i,row) => "123",
	 *			     "Week Day": (v) => v.toUpperCase(),
	 *			     v1: (v) => v===undefined?0:v
	 *		      }; 
	 *		      list.project([ 'mon=Month', 'weekday=Week Day','nurul' , 'v1', 'v2' ], mapper);	    
	 *
	 *	the result is the same as the previous example, but the columns names will now be
	 *			['Month', 'Week Day', 'nurul', 'v1', 'v2' ]
	 * 
	 * [project description]
	 * @param  {[type]}  colsMapping [description]
	 * @param  {[type]}  mappingObj  [description]
	 * @param  {Boolean} flag        [description]
	 * @param  {[type]}  tester      [description]
	 * @return {[type]}              [description]
	 */
	project(colsMapping,mappingObj,flag=false, tester=undefined) {
		if( (!colsMapping || colsMapping.length === 0) && !mappingObj ) return this; //someCols = this.columns.slice(0);
		if(!colsMapping) colsMapping = this.columns;
		let mappedCols = colsMapping.map(n => n.split('=')).map( ([a,b]) => [a, b||a] );

		//check if we are only renaming the columns, then the data does can stay the same, just the columns are renamed
		if( mappingObj === undefined && arrEqual(this.columns,mappedCols.map(([a,b]) => a)) ) {
			return new Frame(this.data,mappedCols.map(([a,b]) => b), this.name + '1');
		}

		let ixList = mappedCols.map( ([name]) => this.colIx(name));//.filter( x => x != -1);
		//let someCols = mappedCols.map(([name]) => name);
		let newCols = mappedCols.map(([name,newName]) => newName);
		let nc = arrDedup(newCols);
		if( nc.length !== newCols.length) {
			throw new Error('project - new column names must be uinque ['+ newCols.join(',')+']');
		}
		const len = this.data.length;
		const data = this.data;
		let result = newArray(len,[]);
		
		
		let len2 = ixList.length;
		let fn;
		//const dummy = [];
		if( mappingObj !== undefined){
			let colMapFn = newCols.map(name => mappingObj[name]);
			for(let i=0; i<len; i++) {
				let row = [];//newArray(len2,dummy);
				let inrow = data[i];
				let ro = (tester || mappingObj) ? this._rowObj(inrow): undefined;
				for(let j=0; j<len2; j++) {
					let pos = ixList[j];
					let v = pos === -1?'': inrow[pos];

					if(tester) {
						if(!tester(ro) ) row.push(v);
						else {
							if( (fn = colMapFn[j]) !== undefined) v = ( flag?fn(ro):fn(v, i, inrow, ro) );
							row.push(v);
						}
					} else {
						if( (fn = colMapFn[j]) !== undefined) v = ( flag?fn(ro):fn(v, i, inrow, ro) );
						row.push(v);
					}
				}
				result[i] = row;
			}

		}
		else {
			for(let i=0; i<len; i++) {
				let row =[]; //new Array(len2);
				let inrow = data[i];
				for(let j=0; j<len2; j++) {
					let pos = ixList[j];
					let v = pos === -1?'': inrow[pos];
					row.push(v);
				}	
				result[i] = row;			
			}
				
		}

		
		//result = this.data.map(row => projectRow(row, ixList));
		return new Frame( result, newCols, this._name, this.keyFunc);
	}

	update(tester,mapper,flag=false) {
		return this.project(undefined,mapper,flag,tester);
	}

	/**
	 * returns a function that can be used iteratively to project one array to another
	 * @param  {[type]}  colsMapping [description]
	 * @param  {[type]}  mappingObj  [description]
	 * @param  {Boolean} flag        [description]
	 * @return {[type]}              [description]
	 */
	trProject(colsMapping,mappingObj,flag=false) {
		if( !colsMapping || colsMapping.length === 0 ) return this; //someCols = this.columns.slice(0);
		let mappedCols = colsMapping.map(n => n.split('=')).map( ([a,b]) => [a, b||a] );

		//check if we are only renaming the columns, then the data does can stay the same, just the columns are renamed
		if( mappingObj === undefined && arrEqual(this.columns,mappedCols.map(([a,b]) => a)) ) {
			return new Frame(this.data,mappedCols.map(([a,b]) => b), this.name + '1');
		}

		let ixList = mappedCols.map( ([name]) => this.colIx(name));//.filter( x => x != -1);
		//let someCols = mappedCols.map(([name]) => name);
		let newCols = mappedCols.map(([name,newName]) => newName);
		let nc = arrDedup(newCols);
		if( nc.length !== newCols.length) {
			throw new Error('project - new column names must be uinque ['+ newCols.join(',')+']');
		}
		
		let len2 = ixList.length;
		
		//element mapping function supplied
		if( mappingObj !== undefined){
			let colMapFn = newCols.map(name => mappingObj[name]);
			let _row = this._rowObj([]);  // create a temp row object
			return (inrow, row) => {
				let fn;
				if( row === undefined) {
					row = [];
					for(let j=0; j<len2; j++) {
						let pos = ixList[j]|0;
						let v = pos === -1?'': inrow[pos];
						if( (fn = colMapFn[j]) !== undefined) {
							//_row.__data = inrow;
							v = ( flag?fn(this._rowObj(inrow)):fn(v, 0, inrow, this._rowObj(inrow)) );
						}
						row.push(v);
					}
				} else {
					for(let j=0; j<len2; j++) {
						let pos = ixList[j]|0;
						let v = pos === -1?'': inrow[pos];
						if( (fn = colMapFn[j]) !== undefined) {
							//_row.__data = inrow;
							v = ( flag?fn(this._rowObj(inrow)):fn(v, 0, inrow, this._rowObj(inrow)) );
						}
						row[j] = v;
					}
				}
				return row;
			};

		}
		else { // no
			return (inrow, row) => {
				if( row === undefined) {
					row = [];
					for(let j=0; j<len2; j++) {
						let pos = ixList[j]|0;
						let v = pos === -1?'': inrow[pos];
						row.push(v);
					}	
				}else {
					for(let j=0; j<len2; j++) {
						let pos = ixList[j]|0;
						let v = pos === -1?'': inrow[pos];
						row[j] = v;
					}
				}
				return row;			
			};
				
		}
	}


	/**
	 * Simple version of project to create a frame with only one column
	 * @param  {[type]} colName [description]
	 * @return {[type]}         [description]
	 */
	column(colName) {
		const ix = this._columns.indexOf(colName);
		if( ix == -1 ) return [];
		return new Frame(this.data.map( v => [v[ix]]), [this._columns[ix]], this._name, this.keyFunc);
	}

	/**
	 * [rawColumn description]
	 * @param  {[type]} colName [description]
	 * @return {[type]}         [description]
	 */
	rawColumn(colName) {
		const ix = this._columns.indexOf(colName);
		if( ix == -1 ) return [];
		return this.data.map( v => v[ix]);
	}

	/**
	 * [row description]
	 * @param  {[type]} ix [description]
	 * @return {[type]}    [description]
	 */
	row(ix) { return this.data[ix]; }

	asObj(ix) { return this._rowObj(this.data[ix]); }


	/**
	 * Convert several columns into a single column, 
	 *   the elements rae converted to theeir string representation
	 *
	 *   e.g aFrame.columns = ['name','street','city','state','zip']
	 *     but we want to convert it into a ['name', 'address'] 
	 *     so: ['street','city','state','zip'] => ['address']
	 *
	 *   newFrame = aFrame.mergeCols(null, ['street','city','state','zip'], 'address',  ", ");
	 * 
	 * @param  {array<string>} cols         columns to keep (may ne null or undefined)
	 * @param  {array<string>} someColsToMerge     [description]
	 * @param  {String} newNameForMergerCol [description]
	 * @param  {string|function} sepOrMergeFunc      [description]
	 * @return {Frame}                     [description]
	 */
	mergeCols(cols, someColsToMerge, newNameForMergerCol, sepOrMergeFunc) {
		
		if( !cols || cols.length === 0) {
			cols = arrRemove(this.columns, someColsToMerge);
		}
		sepOrMergeFunc = sepOrMergeFunc === undefined?',':sepOrMergeFunc;
		let mergeFunc = isString(sepOrMergeFunc)? (arr => arr.join(sepOrMergeFunc)) : sepOrMergeFunc;
		if( !isFunc(mergeFunc)) throw new Error('Merge function of seperator expected');
		let nf = this.project(cols);
		let mergeCols = this.project(someColsToMerge);
		
		return new Frame( nf.data.map((row,ix) => row.concat(joinColsAt(ix)) ),	
						 cols.concat([newNameForMergerCol]),
						 this._name, 
						 this.keyFunc );
		// =======
		function joinColsAt(ix) {
			return [mergeFunc(mergeCols.data[ix].filter(x => x))];
		}
	}

	/**
	 * Similar functionality to array slice
	 * @param  {[type]} first [description]
	 * @param  {[type]} last  [description]
	 * @return {[type]}       [description]
	 */
	slice(first,last) {
		return new Frame(this.data.slice(first,last), this.columns, this._name, this.keyFunc);
	}

	/**
	 * [asStrList description]
	 * @return {[type]} [description]
	 */
	asStrList() {
		return this.data.map(x => x.join('\t'));
	}
	/**
	 * [asObjList description]
	 * @return {[type]} [description]
	 */
	asObjList() {
		return this.data.map(x => this._rawObj(x));
	}
	/**
	 * [_rowObj description]
	 * @param  {[type]} elem [description]
	 * @return {[type]}      [description]
	 */
	_rowObj(elem) {
		//console.log("**************** make raw ********************");
		return new this.AccessClass(elem);
		//return this._columns.reduce((obj, k, ix) => { obj[k] = elem[ix]; return obj; }, {});
	}

	/** 
	 * similar semantics to SQL groupBy, assumes list has bee sorted by 'groupCols'
	 * aFrame.groupBy(['mon',"weekday"], [gbSum('v1','sumV1'), gbCount('weekday', 'numWeekDays'),
	 *                                  	gbMin('v2', 'minV2'), gbMax('v1','maxV1'),
	 *                                    	gbMean('v1','meanV1')
	 *									  ])
	 * 
	 * @param  {[type]} groupCols                  [description]
	 * @param  {[type]} listOfAccumulatorFunctions [description]
	 * @param  {[type]} toSort                     [description]
	 * @return {[type]}                            [description]
	 */
	groupBy(groupCols, listOfAccumulatorFunctions, toSort) {
		let aFrame = this;
		if(toSort === undefined || toSort === true) {
			aFrame.sorted = undefined;
			//aFrame = aFrame.sort(groupCols.filter(name => isString(name), cmpStrBy));
			aFrame = aFrame.sort(groupCols.filter(name => isString(name)));
		}
		return groupBy(groupCols, aFrame, listOfAccumulatorFunctions);
	}

	/**
	 * [find description]
	 * @param  {Function} fn [description]
	 * @return {[type]}      [description]
	 */
	find(fn) {
		let v = this.data.find((x,i) => fn(this._rowObj(x),i,x));
		return v ? this._rowObj(v): undefined;
	}

	/**
	 * remove duplicate rows,
	 * @return {Frame} returns a sorted frame with no duplicates
	 */
	dedup() {
		return this.groupBy(this.columns,undefined,true);
	}
	
	/**
	 * [description]
	 * @param  {function} fn	f(rowObject, )
	 * @return {Array}     [description]
	 */
	map(fn) { return this.data.map( (x,ix,arr) => fn(this._rowObj(x),ix,arr)); }

	/**
	 * [description]
	 * @param  {function} fn	f(rowObject, )
	 * @return {Array}     [description]
	 */
	mapF(fn) { return this.data.map( (x,ix,arr) => fn(this._rowObj(x),ix,arr)); }
	
	/**
	 * Similar to arry reduce except it works on frames
	 * @param  {function} fn   reduce function (acc:T, r:RowObject, index, array)
	 * @param  {T}   ini  initial value  of accumulator type T
	 * @return {T}        return the accumulator
	 */
	reduce(fn, ini) { return this.data.reduce( (acc, x, ix, arr) => fn(acc, this._rowObj(x), ix, arr), ini); }
	
	/**
	 * Concatinate frames and return a new frame (does not modify any of the input frames)
	 * @param  {...Frame} frames list of frames
	 * @return {Frame}           concatination of all the frames
	 */
	concat(...frames) {
		frames = frames.map(haveFrame);
		frames = frames.filter( f => f && f.length > 0);
		if( frames.length === 0) return this;
		frames.forEach(f => {
			let notSame = this.columns.find( v => f.columns.indexOf(v) === -1);
			if( notSame ) throw new Error('incompatible columns: ['+this.columns.join(',')+'] <> ['+f.columns.join(',')+']');
		});
		let arrays = frames.map( 
			f => arrEqual(this.columns, f.columns)? 
				f.data : 
				f.project(this.columns).data 
		);
		let res = [].concat(...[this.data,...arrays]);
		return new Frame(res, this._columns, this._name, this.keyFunc);
	}
	
	/**
	 * [filter description]
	 * @param  {function_array} fnOrArray filter function (r:RowObject,ix,array) or an array of index into the data
	 * @return {[type]}           The filtered frame
	 */
	filter(fnOrArray) { 
		if(!this) throw new TypeError('Filter cannot be use as a raw function');
		if ( typeof fnOrArray === 'function')  {
			let fn = fnOrArray;
			return new Frame(this.data.filter( (x,ix,arr) => fn(this._rowObj(x),ix,arr)), this._columns, this._name, this.keyFunc); 
		}
		else if( Array.isArray(fnOrArray) ) { // expects an array of integer index into the frame return s teh values for all valid index
			let elements = fnOrArray;
			let len = elements.length >>> 0;
			let res = []; //new Array(len);
			let data = this.data;
			let dlen = data.length;
			let i = -1;
			while(++i !== len) {
				let ix = elements[i];
				if(typeof ix !== 'number') continue;
				if(ix <0 || ix >= dlen) continue;
				let r = data[ix];
				if(r) res.push(r);
			}
			// I do not know who added the  two commented out line but that is incorrect code
			
			//let tempFilter = xor(data, res);
			//return new Frame(tempFilter, this._columns, this._name, this.keyFunc); 
			return new Frame(res, this._columns, this._name, this.keyFunc); 
		}
	}

	/**
	 * same as filter but returns the index of the filtered lines
	 * @param  {[type]} func [description]
	 * @return {[type]}      [description]
	 */
	filterIX(func) { 
		if ( ! (typeof func === 'function') && this) 
			throw new TypeError();
		var data = this.data;
		var len = data.length >>> 0,
			res = [],//new Array(len), // preallocate array
			i = -1;
		
		while (++i !== len) if (func(data[i], i, this.asObj(i))) res.push(i); //res[c++] = i;
		//res.length = c; // shrink down array to proper size
		return res;
	}
	/**
	 * [description]
	 * @param  {function} fn 	takes function(row:array, ix, array)
	 * @return {[type]}     [description]
	 */
	forEachF(fn) { this.data.forEach((row, ix, arr) => fn(this._rowObj(row), ix, arr)); }
	/**
	 * [description]
	 * @param  {function} fn 	takes function(row:array, ix, array)
	 * @return {[type]}     [description]
	 */
	forEachRaw(fn) { this.data.forEach( (row,ix,arr) => fn(row,ix,arr)); }

	/**
	 * [description]
	 * @param  {Function} fn       [description]
	 * @param  {[string]}   newCols [description]
	 * @return {Frame}            [description]
	 */
	
	mapRaw(fn,newCols) { return new Frame(this.data.map(fn), newCols || this._columns, this._name, this.keyFunc); }
	
	/**
	 * [description]
	 * @param  {Function} fn   [description]
	 * @param  {[type]}   ini  [description]
	 * @return {[type]}        [description]
	 */
	reduceRaw(fn, ini) { return this.data.reduce( fn, ini); }
	
	/**
	 * [description]
	 * @param  {[type]} fn 	[description]
	 * @return {[type]}     [description]
	 */
	filterRaw(fn) { return new Frame(this.data.filter(fn),this._columns, this._name, this.keyFunc); }
	
	// /**
	//  * [tallies description]
	//  * @param  {Number} k [description]
	//  * @return {[type]}   [description]
	//  */
	// tallies(k=10) {
	// 	return this.columns.map( x => [x, arrayTally(this.rawColumn(x),k)]).reduce( (ret,[name, tal]) => { ret[name]=tal; return ret;},{});
	// }
	
	// *
	//  * [talliesMap description]
	//  * @param  {Function} fn [description]
	//  * @param  {Number}   k  [description]
	//  * @return {[type]}      [description]
	 
	// talliesMap(fn,k=10) {
	// 	return this.columns.map( x => [x, arrayTallyFn(fn,this.rawColumn(x),k)]).reduce( (ret,[name, tal]) => { ret[name]=tal; return ret;},{});
	// }


	_fix(fn,aFrame) {
		let self = this;
		if( fn === undefined ) return fn;
		return function(a,b) {
			if( Array.isArray(a) && Array.isArray(b) ) return fn(self._rowObj(a), aFrame._rowObj(b));
			return fn(a,b);
		};
	}

	/**
	 * [innerJoin description]
	 * @param  {[type]} aFrame    [description]
	 * @param  {[type]} colsToMap [description]
	 * @param  {[type]} joinOn    [description]
	 * @param  {[type]} filter    [description]
	 * @return {[type]}           [description]
	 */
	innerJoin(aFrame, colsToMap, joinOn, filter) {
		return innerJoin(this,aFrame, colsToMap, joinOn, this._fix(filter,aFrame));
	}


	/**
	 * [leftJoin description]
	 * @param  {[type]} aFrame    [description]
	 * @param  {[type]} colsToMap [description]
	 * @param  {[type]} joinOn    [description]
	 * @param  {[type]} filter    [description]
	 * @return {[type]}           [description]
	 */
	leftJoin(aFrame, colsToMap, joinOn, filter) {
		return leftJoin(this,aFrame, colsToMap, joinOn, this._fix(filter,aFrame));
	}

	/**
	 * [outerJoin description]
	 * @param  {[type]} aFrame    [description]
	 * @param  {[type]} colsToMap [description]
	 * @param  {[type]} joinOn    [description]
	 * @param  {[type]} filter    [description]
	 * @return {[type]}           [description]
	 */
	outerJoin(aFrame, colsToMap, joinOn, filter) {
		return outerJoin(this,aFrame, colsToMap, joinOn, this._fix(filter,aFrame));
	}

	/**
	 * [withIndex description]
	 * @return {[type]} [description]
	 */
	withIndex(atEnd) {
		return frameWithIndex(this,atEnd);
	}

	/**
	 * [numericColumns description]
	 * @param  {[type]} aFrame [description]
	 * @return {[type]}        [description]
	 */
	numericColumns(aFrame) {
		let threshold = Math.trunc(this.length*0.9);
		let a = this.data.map(row => row.map(v => (isNum(v)|| !v)?1:0));
		let sums = a.reduce(vecAdd,undefined); 
		//console.log({threshold, sums});
		return this.columns.map((c,i) => (sums[i]>threshold) ? c :undefined).filter(x => x);
   
	}

	

	_toHtml() {
		let columns = this.columns;
		let TX = columns.indexOf('RULE_TYPE');
		let self = this;
		return (
			//`<style> table.ftable {border-collapse: collapse; border-spacing: 0;  border: 2px solid #CCC; } \n</style>\n`+
			`<style> 
				table .ftable  { font-family: arial, sans-serif; color: blue } 
				td, th, tr { border: 1px solid #000000; text-align: left; } 
				tr:nth-child(even) { background-color: #dddddd; } }
			</style>\n`+
			'<p>Length: ' + this.length + '</p>' +
			'<table class="ftable" style="border-collapse: collapse; border-spacing: 0;  border: 2px solid #000; font-size: 1rem"><thead style="background-color: lightgrey">' +
			'<tr style="border: 2px solid #000"><td style="border: 2px solid #000">Ix</td>' + columns.map(c => '<td style="border: 2px solid #000">' + c.replace(/_/g, ' ') + '</td>').join('') + '</tr></thead><tbody>' +
			this.data.slice(0, Math.min(this.length, this.showLen)).map(showRow).join('') +
			'</tbody></table>'
		);
		function showRow(r, i) {
			let rowColor = self.rowColor(self._rowObj(r),i);
			return ('<tr style="background-color: ' + rowColor + '"><td style="border: 2px solid #000">' + i + '</td>' + r.map(c => '<td style="border: 2px solid #000">' + (ns(c)) + '</td>').join('') + '</tr>');
		}
		function ns(s) {
			if (typeof s !== 'string') return (s === undefined ? '' : '' + s) || '';
			if (s.indexOf('<') !== -1) s = s.replace(/</g, '&lt;');
			if (s.indexOf('>') !== -1) s = s.replace(/>/g, '&gt;');
			return (s === undefined ? '' : '' + s) === 'NON' ? 'NS' : s;
		}
	}


}
