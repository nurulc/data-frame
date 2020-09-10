// jshint undef:true
// jshint unused:true
/*
Copyright (c) 2020, Nurul Choudhury
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
// Frame - similar to pandas in python

//import { getFreq } from './frequency';
import BaseFrame from './BaseFrame';
import { createAccesClass } from './frame_element';
import sortFrameBy from './sortframe';
import {groupBy} from './groupby';
import frameWithIndex from './frame-utils/frameWithIndex';
import { arrRemove, arrDedup, newArray } from '../array';
import {EMPTY_ARRAY} from '../utils/constants';
import {K} from '../utils';
import {toNumber} from '../utils/sort-helper';
import {innerJoin, leftJoin, outerJoin} from './join-utils';
//import {combineCmp, cmpNumOrStrBy, toNumber, revCmp} from '../utils/sort-helper';
//import genColIxFunc from './genColIxFunc';
import haveFrame from './haveFrame';
import arrEqual from '../array/arrEQ';
import toHTML from './toHTML';
//import {arrayUniq, _makeUnique} from './makeUnique';
import {_makeUnique} from './makeUnique';
import {vecAdd,zipToDict} from '../array/arrayutils';



function isString(aStr) { return typeof aStr === 'string'; }
function isFunc(f) { return typeof f === 'function'; }
function isNum(v) {return v !== '' && !isNaN(+v); }

// function strCmp(a,b) {
// 	if(a === b) return 0;
// 	return a<b?-1:1;
// }
// const cmpStrBy = (colIX) => (row1,row2) => (strCmp(row1[colIX],row2[colIX]));

function Identity(x) { return x; }



// function objName(o) {
// 	if(typeof o === 'object' ) return o.constructor.name;
// 	return typeof o;
// }




/**
 * 
 */
export class Frame extends BaseFrame {
	/**
	 * [constructor description]
	 * @param  {[type]} data    [description]
	 * @param  {[type]} columns [description]
	 * @param  {[type]} name    [description]
	 * @param  {[type]} keyFunc [description]
	 * @return {[type]}         [description]
	 */
	constructor(data,columns,name,keyFunc) {
		super(data,columns,name,keyFunc);
		this._unique = undefined;
		this._sortCols = EMPTY_ARRAY;
		this._row = undefined;
		this.AccessClass = columns?createAccesClass(this._columns):undefined;
		this.showLen = 400;
		this._hash = -1;
	}

	

// ======================================================================

	asObj(ix) { return this._rowObj(this.data[ix]); }

	get rows() { 
		if(this._rows === undefined) 
			this._rows = this.data.map(r => this._rowObj(r));
		return this._rows; 
	}



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
	 * [asObjList description]
	 * @return {[type]} [description]
	 */
	asObjList() {
		return this.data.map(x => this._rowObj(x));
	}
	/**
	 * [_rowObj description]
	 * @param  {[type]} elem [description]
	 * @return {[type]}      [description]
	 */
	_rowObj(elem) {
		return new this.AccessClass(elem);
	}

	/**
	 * [withIndex description] ()
	 * @return {[type]} [description]
	 */
	withIndex(atEnd) {
		return frameWithIndex(this,atEnd);
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
	 * [description]
	 * @param  {function} fn	f(rowObject, )
	 * @return {Array}     [description]
	 */
	map(fn) { return this.mapF(fn); }

	/**
	 * [description]
	 * @param  {function} fn	f(rowObject, )
	 * @return {Array}     [description]
	 */
	mapF(fn) { return fn !== undefined ? this.data.map( (x,ix,arr) => fn(this._rowObj(x),ix,arr)) : this.asObjList(); }
	
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
		return new this.constructor(res, this._columns, this._name, this.keyFunc);
	}
	

	/**
	 * [description]
	 * @param  {function} fn 	takes function(row:array, ix, array)
	 * @return {[type]}     [description]
	 */
	forEachF(fn) { this.data.forEach((row, ix, arr) => fn(this._rowObj(row), ix, arr)); }

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
	 * [filter description]
	 * @param  {function_array} fnOrArray filter function (r:RowObject,ix,array) or an array of index into the data
	 * @return {[type]}           The filtered frame
	 */
	filter(fnOrArray) { 
		if(!this) throw new TypeError('Filter cannot be use as a raw function');
		if ( typeof fnOrArray === 'function')  {
			let fn = fnOrArray;
			let row = this._rowObj([]);
			return new this.constructor(this.data.filter( (x,ix,arr) => fn((row.__data=x,row),ix,arr)), this._columns, this._name, this.keyFunc); 
		}
		else if( Array.isArray(fnOrArray) ) { // expects an array of integer index into the frame return s teh values for all valid index
			let elements = fnOrArray;
			let len = elements.length >>> 0;
			let res = []; //new Array(len);
			let data = this.data;
			let dlen = data.length;
			let i = -1;
			let newColName = fnOrArray.map(i => this._columns[i] || 'COL_'+i)
			while(++i !== len) {
				let ix = elements[i];
				if(typeof ix !== 'number') continue;
				if(ix <0 || ix >= dlen) continue;
				let r = data[ix];
				if(r !== undefined) res.push(r);
			} 
			return new this.constructor(res, newColName, this._name, this.keyFunc); 
		}
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
	 *				 nurul: (v, rowObj, i,row) => "123",
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
	project(colsMapping,mappingObj,filter=undefined,flag=false, tester=undefined) {
		if( (!colsMapping || colsMapping.length === 0) && !mappingObj ) return this; //someCols = this.columns.slice(0);
		if(!colsMapping) colsMapping = this.columns;
		if( filter && !isFunc(filter)) throw new TypeError('Filter: '+filter+' must be a function');
		let mappedCols = colsMapping
			.map(n => n.split('=')) // convert 'original column name' and 'new column name' pair 
			.map(([originalName,newName]) => [originalName, newName||originalName] );
		//check if we are only renaming the columns, then the data does can stay the same, just the columns are renamed
		if( mappingObj === undefined && filter === undefined && arrEqual(this.columns,mappedCols.map(([a]) => a)) ) {
			return new this.constructor(this.data,mappedCols.map(([,b]) => b), this.name + '1');
		}

		let ixList = mappedCols.map( ([name]) => this.colIx(name));// get index of column in the original data

		let newCols = mappedCols.map(([,newName]) => newName);
		if( arrDedup(newCols).length !== newCols.length) {
			throw new Error('project - new column names must be uinque ['+ newCols.join(',')+']');
		}
		const len = this.data.length;
		const data = this.data;
		let result = filter?[]:newArray(len,[]);
		
		
		let len2 = ixList.length;
		let fn;

		if( mappingObj ){
			let colMapFn = newCols.map(name => mappingObj[name]);

			for(let i=0; i<len; i++) {
				let row = [];//newArray(len2,dummy);
				let inrow = data[i];
				let ro = (tester || mappingObj || filter) ? this._rowObj(inrow): undefined;
				if(filter && !filter(ro)) continue;
				for(let j=0; j<len2; j++) {
					let pos = ixList[j];
					let v = pos === -1?'': inrow[pos];

					if(tester) {
						if(!tester(ro, newCols[i])) row.push(v);
						else {
							if( (fn = colMapFn[j]) !== undefined) v = ( flag?fn(ro):fn(v, ro, i, inrow) );
							row.push(v!==undefined?v:'');
						}
					} else {
						if( (fn = colMapFn[j]) !== undefined) v = ( flag?fn(ro):fn(v, ro, i, inrow) );
						row.push(v!==undefined?v:'');
					}
				}
				if(filter) result.push(row); 
				else result[i] = row;
			}

		}
		else {
			for(let i=0; i<len; i++) {
				let row =[];
				let inrow = data[i];
				if(filter) {
					let ro = this._rowObj(inrow);
					if(!filter(ro) ) continue;
				}
				for(let j=0; j<len2; j++) {
					let pos = ixList[j]; // get position (index) in origimal data
					let v = pos === -1?'': inrow[pos];
					row.push(v);
				}	
				if(filter) result.push(row); 
				else result[i] = row;			
			}
				
		}

		
		//result = this.data.map(row => projectRow(row, ixList));
		return new this.constructor( result, newCols, this._name, this.keyFunc);
	}

	select(columns, where) {
		let cols = columns.map( name => {
			let nameStr = name;
			let func;

			if(Array.isArray(name)) [nameStr,func] = name;
			
			if( !isString(nameStr)) throw new TypeError('expected a column name');
			let [oldName, newName] = nameStr.split('=');
			return [oldName, (newName|| oldName), func];
		});

		function toFunc(v) {
			if(isFunc(v)) return v;
			return K(v);
		}
		let mapper = cols.filter(([ , ,fn]) => fn !== undefined)
			.map(([ ,nn,fn]) => [nn, toFunc(fn)]);
		let colMap = undefined;
		if(mapper.length) colMap = zipToDict(mapper);
		
		return this.project(
			cols.map(([oldName, newName]) => oldName+'='+newName),
			colMap, 
			where);

	}

	update(mapper,tester, flag=false) {
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
		if( !colsMapping || colsMapping.length === 0 ) return () => []; //nothing to maporiginalName
		let mappedCols = colsMapping
			.map(n => n.split('=')) // convert 'original column name' and 'new column name' pair 
			.map(([originalName,newName]) => [originalName, newName||originalName] );


		//check if we are only renaming the columns, then the data does can stay the same, just the columns are renamed
		if( mappingObj === undefined && arrEqual(this.columns,mappedCols.map(([originalName,newName]) => originalName)) ) {
			return (inrow,row) => {
				if(!row) return inrow.slice(0);
				for(let i =0; inrow.length; i++) row[i] = inrow[i];
				return row;
			};
		}

		let ixList = mappedCols.map( ([name]) => this.colIx(name));//.filter( x => x != -1);
		//let someCols = mappedCols.map(([name]) => name);
		let newCols = mappedCols.map(([,newName]) => newName);
		let nc = arrDedup(newCols);
		if( nc.length !== newCols.length) {
			throw new Error('project - new column names must be uinque ['+ newCols.join(',')+']');
		}
		
		let len2 = ixList.length;
		
		//element mapping function supplied
		if( mappingObj !== undefined){
			let colMapFn = newCols.map(name => mappingObj[name]);
			return (
				(inrow, row) => {
					let fn;
					const push = ( row === undefined) ? 
						( v => row.push(v)) :
						( (v,j) => row[j] = v );
					row = row || [];
					for(let j=0; j<len2; j++) {
						let pos = ixList[j]|0;
						let v = pos === -1?'': inrow[pos];
						if( (fn = colMapFn[j]) !== undefined) {
							v = ( flag?fn(this._rowObj(inrow)):fn(v, 0, inrow, this._rowObj(inrow)) );
						}
						push(v,j);
					}
					return row;
				}
			);

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
	 * Creates a filter function the for the additional join checck
	 * Note the primary joining action (primary criterion) is the joinOp which look like this
	 * joinOp => 'commonColumnNameInBothFrames' or 'colFram1==colFrame2'
	 * 
	 * @param  {Function} function to compare 2 rows a and b 
	 * @param  {[type]}   
	 * @return {[type]}
	 */
	_genAuxJoinFilter(fn,aFrame) {
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
		return innerJoin(this,aFrame, colsToMap, joinOn, this._genAuxJoinFilter(filter,aFrame));
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
		return leftJoin(this,aFrame, colsToMap, joinOn, this._genAuxJoinFilter(filter,aFrame));
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
		return outerJoin(this,aFrame, colsToMap, joinOn, this._genAuxJoinFilter(filter,aFrame));
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
			aFrame = aFrame.sort(groupCols.filter(name => isString(name)));
		}
		return groupBy(groupCols, aFrame, listOfAccumulatorFunctions);
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

	get unique() {
		if(this._unique === undefined) {
			this.makeUnique();
		}
		return this._unique;
	}

	get numericColumns() {
		const threshold = Math.trunc(this.length * 0.9);
		const a = this.data.map(row => row.map(v => ((isNum(v) || !v) ? 1 : 0)));
		const sums = a.reduce(vecAdd);

		return this.columns.map((c, i) => ((sums[i] > threshold) ? c : undefined)).filter(Identity);
	}

	convertData(convList) {
		let _data = newArray(this.length, []);
		if(convList === undefined || convList.length === 0) {
			let len = this.length;
			let data = this.data;
			for(let i = 0; i<len; i++) {
				let row = data[i];
				if( row.some(x => typeof x === 'string' && isNum(x)) ) {
					row = row.map(v => isNum(v) ?toNumber(v): v);
				}
				_data[i] = row;
			}
		} else {
			//throw new Error('custom conversion is not supported');
			
			let len = this.length;
			let data = this.data;
			let dummy = data.length?data[0].slice(0):[];
			let rlen = this.columns.length;

			let cLen = convList.length;
			for(let i = 0; i<len; i++) {
				let row = data[i];
				let changed = false;
				for(let col=0; col<rlen; col++) {
					dummy[col] = row[col];
					for(let k=0; k<cLen; k++) {
						if(convList[k][0](row[col])) {
							dummy[col] = convList[k][1](row[col]);
							changed = true;
							break;	
						} 
					}
				}
				if(changed) _data[i] = dummy.slice(0);
				else _data[i] = row;
			}

		}
		if(arrEqual(this.data,_data)) {
			// nothing changed
			return this;
		}
		return this.constructor(_data,this.columns,this.name,this.keyFunc);
	}

	
	/*
	 * return a frame where all rows are unique, i.e. remove duplicate rows,
	 * @return {Frame} returns a sorted frame with no duplicates
	 */
	distinct() {
		return this.groupBy(this.columns,undefined,true);
	}
	


	_toHtml() {
		return toHTML(this);
	}


}

function toString(x) {
	return x.toString();
}

Frame.HTMLFormat = {
	number: toString,
	other: toString
};

