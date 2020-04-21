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
import { dataSplit } from '../string/csv';
import sortFrameBy from './sortframe';
import {groupBy} from './groupby';
import frameWithIndex from './frame-utils/frameWithIndex';
import { flatten, arrRemove, arrDedup, newArray, vecAdd, arrHash} from '../array';
import { isA } from '../utils/objutils';
import {EMPTY_ARRAY} from '../utils/constants';
import {innerJoin, leftJoin, outerJoin} from './join-utils';
import {combineCmp, cmpNumOrStrBy, toNumber, revCmp} from '../utils/sort-helper';
import genColIxFunc from './genColIxFunc';
import haveFrame from './haveFrame';
import arrEqual from '../array/arrEQ';
import toHTML from './toHTML';
import {arrayUniq, _makeUnique} from './makeUnique';



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

function Identity(x) { return x; }



function objName(o) {
	if(typeof o === 'object' ) return o.constructor.name;
	return typeof o;
}

// *
//  * [description]
//  * @param  {[type]} list [description]
//  * @return {[type]}      [description]
 
// export const arrayTallySorted = (list) => arrayTally(list);//.sort( (a,b) => a.count < b.count);

// /**
//  * [description]
//  * @param  {[type]} list [description]
//  * @return {[type]}      [description]
//  */
// export const arrayUniq = (list)  => Object.keys(_makeUnique(list)).sort();



// const EMPTY_STR = '';
// /**
//  * @param  {[[column_elements...]...]} listOfRows 
//  * @param  {[type]} colIx 	The column to make unique
//  * @return {dict}   returns an object representing mapping of unique values where key and value are the same
//  */
// function _makeUnique(listOfRows,colIx) {

// 	let dict = {};
// 	if( colIx === undefined) {
// 		let list = listOfRows; // the list just has data
// 		let len = list.length;
// 		for(let i = 0; i<len;i++) { 
// 			let row = list[i];
// 			let rlen = row.length;
// 			for(let k=0; k< rlen; k++){
// 				let x = row[k];
// 				if( typeof x === 'string' || x === undefined) {
// 					x = x===undefined ? EMPTY_STR :x;
// 					let nv = dict[x];
// 					if(nv === undefined) dict[v] = nv = x;
// 					row[k] = nv;
// 				}
// 			}
// 		} 
// 	}
// 	else {
// 		let len = listOfRows.length;
// 		let cnt = len<5000? len: Math.max(5000, Math.trunc(len/3));
// 		for(let i = 0; i<len;i++) {
// 			let row = listOfRows[i];
// 			let v = row[colIx];
// 			if( v === undefined || typeof v === 'string'  ) {
// 				if( !v ) {
// 					row[colIx] = EMPTY_STR;
// 				} else {
// 					let nv = dict[v];
// 					if(nv === undefined && cnt-- > 0) dict[v] = nv = v;
// 					else nv = v;
// 					row[colIx] = nv;
// 				}
// 			}
// 		} 
// 	}
// 	return dict;
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
		this._hash = -1;
	}

	/**
	 * Create a new frame based of this frame but with new data
	 * @param {[[string]]} d    new data for the frame (but with the same columns
	 * @param {String} name optional ne name
	 */
	setData(d,name) {
		return new this.constructor(d, this.columns, name || this.name, this.keyFunc);
	}

	_getKey(i) {
		return this.data[i][0];
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
		return new this.constructor(this.data, this.columns, this.name, this.keyFunc);
	}
	get length() { return (this.data || EMPTY_ARRAY).length; }
	get name() { return this._name; }
	set name(aName) {
		return new this.constructor(this.data, this.columns, aName, this.keyFunc);
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
	 * [numericColumns description]
	 * @param  {[type]} aFrame [description]
	 * @return {[type]}        [description]
	 */
	numericColumns(aFrame) {
		let threshold = Math.trunc(this.length*0.9);
		let a = this.data.map(row => row.map(v => (isNum(v))?1:(v === '' || v === undefined )? 0.5 : 0));
		let sums = a.reduce(vecAdd,undefined); 
		return this.columns.map((c,i) => (sums[i]>threshold) ? c :undefined).filter(x => x);
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
	 * @param  {Function} fn   [description]
	 * @param  {[type]}   ini  [description]
	 * @return {[type]}        [description]
	 */
	reduceRaw(fn, ini) { return this.data.reduce( fn, ini); }
	


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
	
	mapRaw(fn,newCols) { return new this.constructor(this.data.map(fn), newCols || this._columns, this._name, this.keyFunc); }
	
	/**
	 * [description]
	 * @param  {[type]} fn 	[description]
	 * @return {[type]}     [description]
	 */
	filterRaw(fn) { return new this.constructor(this.data.filter(fn),this._columns, this._name, this.keyFunc); }

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
			return new this.constructor(res, this._columns, this._name, this.keyFunc); 
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
						if(!tester(ro)) row.push(v);
						else {
							if( (fn = colMapFn[j]) !== undefined) v = ( flag?fn(ro):fn(v, ro, i, inrow) );
							row.push(v);
						}
					} else {
						if( (fn = colMapFn[j]) !== undefined) v = ( flag?fn(ro):fn(v, ro, i, inrow) );
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
		if( !colsMapping || colsMapping.length === 0 ) return (inrow,row) => []; //nothing to map
		let mappedCols = colsMapping.map(n => n.split('=')).map( ([a,b]) => [a, b||a] );

		//check if we are only renaming the columns, then the data does can stay the same, just the columns are renamed
		if( mappingObj === undefined && arrEqual(this.columns,mappedCols.map(([a,b]) => a)) ) {
			//return new Frame(this.data,mappedCols.map(([a,b]) => b), this.name + '1');
			return (inrow,row) => {
				if(!row) return inrow.slice(0);
				for(let i =0; inrow.length; i++) row[i] = inrow[i];
				return row;
			};
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
			//let _row = this._rowObj([]);  // create a temp row object
			return (
				(inrow, row) => {
							let fn;
							const push = ( row === undefined) ? 
									( (v,j) => row.push(v)) :
									( (v,j) => row[j] = v );
							row = row || [];
							for(let j=0; j<len2; j++) {
								let pos = ixList[j]|0;
								let v = pos === -1?'': inrow[pos];
								if( (fn = colMapFn[j]) !== undefined) {
									//_row.__data = inrow;
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
			//aFrame = aFrame.sort(groupCols.filter(name => isString(name), cmpStrBy));
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


	/**
	 * remove duplicate rows,
	 * @return {Frame} returns a sorted frame with no duplicates
	 */
	dedup() {
		return this.groupBy(this.columns,undefined,true);
	}
	


	_toHtml() {
		return toHTML(this);
	}


}



