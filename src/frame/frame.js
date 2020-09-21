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
import frameToString from './frame-utils/frameToString';
import frameFromString from './frame-utils/frameFromBuffer';
import { arrRemove, arrDedup, newArray } from '../array';
import {EMPTY_ARRAY} from '../utils/constants';
import {K,isA, isEmpty} from '../utils';
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



const isString = isA.str;
const isFunc = isA.func;
const arrOfStr = isA.arrayOf(isA.str);
function isNum(v) {return v !== '' && !isNaN(+v); }
function Identity(x) { return x; }



// function objName(o) {
// 	if(typeof o === 'object' ) return o.constructor.name;
// 	return typeof o;
// }

function eqaulRow(row1, row2) {
	if( row1 === row2 ) return true;
	return ( row1.length === row2.length && arrEqual(row1, row2));
}


/**
 * This pure data structure represent a database like table
 * internally it consists of rows and columns representing a generalized 2d matrix
 * You can also think of this like a limited excel sheet.
 * No operation will visibly modify the Frame, all operations create a new frame
 * The class takes considerable effort to reuse as much of the internal data as possible
 * to minimize the amount of garbage collection that is necessary.
 *
 * It easily handles large number of rows and columns and has been tested to work well
 * with over 1 million rows with hundreds of columns. The real limitation is the amount of ram
 * available to Javascript.
 * 
 */
export class Frame extends BaseFrame {
	/**
	 * construct a new frame, Note once you have passed the data and column arguments, you no longer own those
	 * two items and should not modify them or any of their content
	 * 
	 * @param  {Array} data    the data fot the frame is an array of rows and each row is an array of strings or numbers
	 * @param  {Array} columns array of strings representing the column names
	 * @param  {[type]} name    optional name for the frame
	 * @param  {[type]} keyFunc optional function that is present will return the column represinting the unique key
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
	/**
	 * [asObj description]
	 * @param  {[type]} ix [description]
	 * @return {[type]}    [description]
	 */
	asObj(ix) { return this._rowObj(this.data[ix], ix); }
	
	/**
	 * Get an array of row objects
	 * @return {[RowObject]} array of row objects
	 */
	get rows() { 
		if(this._rows === undefined) 
			this._rows = this.asObjList();
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
		
		return new Frame( 
			nf.data.map((row,ix) => row.concat(joinColsAt(ix)) ),	
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
		return this.data.map((x,i) => this._rowObj(x,i));
	}
	/**
	 * _rowObj This is an code efficient mathod of accessing the element of the 'rowLikeArray' 
	 * using the columns names of the frame. The RowElement created is a facade to the rowLikeArray,
	 * it does not actuall copy the elements of the array to itself. It is just a convinient way
	 * of retrieving the elements of the array by name.
	 *
	 * e.g. if the this.columns : ['name', 'age', 'sex']
	 *
	 * let arr = ['Jane', 21, 'Female'];
	 * let ro = this._rowObj(arr,5);
	 *
	 * ro.sex   is the same as arr[2] == 'Female'
	 * ro.name  === arr[0]
	 * ro._index$ === 5
	 *
	 * Finally:
	 * arr[2] = 'Male';
	 * ro.sex === 'Male'
	 * 
	 * @param  {row} rowLikeArray array representing the row, this array should have the same length as the rows in the frame
	 * @param  {int32} ix row number
	 * @return {RowObject}      row object representing the element
	 */
	_rowObj(rowLikeArray,ix) {
		return new this.AccessClass(rowLikeArray,ix);
	}

	/**
	 * withIndex add an index column to the befining of the frame or at the end of the frame
	 * @param  {boolean} indexName Name of the index defaults to _INDEX
	 * @param  {boolean} atEnd if true the index is placed on the last column, otherwise it is the first column
	 * @return {[type]} [description]
	 */
	withIndex(indexName='_INDEX',atEnd) {
		return frameWithIndex(this,indexName,atEnd);
	}


	/**
	 * find a row using the test function fn. The test function recieves a row ia s RowObject facade, see _rowObj method.
	 * @param  {Function} fn function with a test criterion for the find operation 
	 * @return {row_object}      undefined if nothing found or a RowObject for the row matching the test function
	 */
	find(fn) {
		let row = this._rowObj();
		let len = this.length;
		let data = this.data;
		for(let i=0; i<len; i++) {
			let x = data[i];
			if(fn(row.__unsafeSet(x,i),i)) return this._rowObj(x,i);
		}
		return undefined;
	}


	/**
	 * [description]
	 * @param  {function} fn	f(rowObject, )
	 * @return {Array}     [description]
	 */
	map(fn) { return this.mapF(fn); }

	/**
	 * Similar to Array.map
	 * @param  {function} fn	takes fn(rowObject, index, this.data )
	 * @return {Array}     [description]
	 */
	mapF(fn) { 
		let ro = this._rowObj();
		return this.data.map((row,i,arr) => fn(ro._unsafeSet(row,i),i,arr)); 
	}	

	/**
	 * Similar to arry reduce except it works on frames
	 * @param  {function} fn   reduce function (acc:T, r:RowObject, index, array)
	 * @param  {T}   ini  initial value  of accumulator type T
	 * @return {T}        return the accumulator
	 */
	reduce(fn, ini) { return this.data.reduce( (acc, x, ix, arr) => fn(acc, this._rowObj(x,ix), ix, arr), ini); }
	
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
	 * similar to an array forEach
	 * @param  {function} fn 	takes function(row:array, ix, array)
	 */
	forEachF(fn) { this.data.forEach((row, ix, arr) => fn(this._rowObj(row,ix), ix, arr)); }

	/**
	 * same as filter but returns the index of the filtered lines
	 * @param  {function} func filter function
	 * @return {[int32]}  returns an array of row indexes (indicies)
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
	 * Takes a filter function or an array of row indicies and returns a new Frame with the selected rows
	 * @param  {function_array} fnOrArray filter function (r:RowObject,ix,array) or an array of index into the data
	 * @return {[type]}           A new frame with rows filtered out
	 */
	filter(fnOrArray) { 
		if(!this) throw new TypeError('Filter cannot be use as a raw function');
		if ( typeof fnOrArray === 'function')  {
			return this.project(undefined, undefined, fnOrArray);
			// let fn = fnOrArray;
			// let row = this._rowObj();
			// return new this.constructor(
			// 	this.data.filter( (x,ix,arr) => fn(row.__unsafeSet(x,ix),ix,arr)), 
			// 	this._columns, this._name, 
			// 	this.keyFunc); 
		}
		else if( Array.isArray(fnOrArray) ) { // expects an array of integer index into the frame return s teh values for all valid index
			let elements = fnOrArray;
			let len = elements.length >>> 0;
			let res = []; //new Array(len);
			let data = this.data;
			let dlen = data.length;
			let i = -1;
			let newColName = fnOrArray.map(i => this._columns[i] || 'COL_'+i);
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
	 * remove all redundent copies of strings, this is the only destructive operation oan aframe
	 * while still maintaining functional purity
	 * @return {[type]}        [description]
	 */
	makeUnique() {
		//if(this._unique) return this;
		let len = this.columns.length;
		let columns = this.columns, data = this.data;
		let res = {};
		for(let i=0; i<len; i++) {
			res[columns[i]] = Object.keys(_makeUnique(data, i)).sort();
		}
		//this._unique = retain?res:true;
		return this;
	}


	/**
	 * 
	 *   colsMapping can be a 
	 *   		1. rearranged list of col names from the frame e.g [ 'B', 'A', 'F']
	 *   		2. or rearranged list of col names [ 
	 *   		   ...('columnName' | 'oldName=newName' | 'newColumnName')
	 *   		   ] 
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
	 *            function toNm(x) { x? (+x) : 0; }
	 *            var mapper1 = {
	 *			     nurul: () => "123",
	 *			     "Week Day": v => v?v.toUpperCase(): '',
	 *			     v1: (v) => v===undefined?0:v,
	 *			     v3: (v, rowObj) => toNm(rowObj.v1) + toNm(rowObj.v2) // sum of v1 and v2
	 *		      }; 
	 *		      list.project([ 'mon=Month', 'weekday=Week Day','nurul' , 'v1', 'v2', 'v3' ], mapper);	    
	 *
	 *	the result is the same as the previous example, but the columns names will now be
	 *			['Month', 'Week Day', 'nurul', 'v1', 'v2', 'v3' ]
	 * 
	 * [project description]
	 * @param  {selected_columns}  colsMapping array of strings
	 * @param  {Object}  mappingObj  a mapping object with { newColumnNam: mappingFunction(oldCellValue, rowObj, rowNumber, rawRowArray)}
	 * @param  {function}  filter    a filter function applied to the original row to determine if the row should be included
	 * @param  {function}  tester    if a function to test if a column/row should have a mapping applied
	 * @return {Frame}              a new Frame with the selected columns, mappings, and filters applied 
	 */
	project(colsMapping,mappingObj,filter=undefined, tester=undefined) {
		if(filter && !isA.func( filter ) ) throw new TypeError('filter must be a function');
		if(tester && !isA.func(tester) ) throw new TypeError('tester must be a function');
		if(mappingObj && !isA.obj(mappingObj)) throw new TypeError('mappingObj must be a object');
		if(colsMapping !== undefined) {
			if(isA.func(colsMapping)) {
				colsMapping = colsMapping(this, mappingObj); // apply the function to get the actual mapping
			}
			if( !isEmpty(colsMapping) && !arrOfStr(colsMapping) ) {
				throw new TypeError('colsMapping must be an array of strings or undefined');
			}
		}
		if( isEmpty(colsMapping) && isEmpty(mappingObj) && isEmpty(filter) ) return this; //someCols = this.columns.slice(0);
		if( isEmpty(colsMapping) ) colsMapping = this.columns;
		if( filter && !isFunc(filter)) throw new TypeError('Filter: '+filter+' must be a function');
		let mappedCols = colsMapping
			.map(n => n.split('=')) // convert 'original column name' and 'new column name' pair 
			.map(([originalName,newName]) => [originalName, newName||originalName] );
		//check if we are only renaming the columns, then the data does can stay the same, just the columns are renamed
		
		if( mappingObj === undefined &&  arrEqual(this.columns,mappedCols.map(([a]) => a)) ) {
			// Note with no mappingObj - tester plays no part even if it is defined
			// column order is unchanges, no value mapping, but column name may change and some rows may be filtered away
			let data = this.data; // assume no filtering operation
			if(filter !== undefined) {
				// some filtering is potentially happening
				let row = this._rowObj();
				data = this.data.filter( (x,ix,arr) => fn(row.__unsafeSet(x,ix),ix,arr));
			}
			
			let columns = mappedCols.map(([,b]) => b);
			let name = (this.name||'')+'1';
			if( arrEqual(this.columns, columns)) {
				// no column name change
				columns = this.columns;
				name = this.name;
			}

			if( columns === this.columns && data === this.data) return this; // no change
			return new this.constructor(data,columns, name);
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
			let roV = this._rowObj();
			for(let i=0; i<len; i++) {
				let row = [];//newArray(len2,dummy);
				let inrow = data[i];
				let ro = (tester || mappingObj || filter) ? roV.__unsafeSet(inrow,i): undefined;
				if(filter && !filter(ro)) continue;
				for(let j=0; j<len2; j++) {
					let pos = ixList[j];
					let v = pos === -1?'': inrow[pos];

					if(tester && !tester(ro, newCols[j])) row.push(v);
					else {
						if( (fn = colMapFn[j]) !== undefined) v = fn(v, ro, pos, inrow);
						row.push(v!==undefined?v:'');
					}
				}
				if(filter) result.push(row); 
				else result[i] = row;
			}

		}
		else {
			let ro = this._rowObj();
			for(let i=0; i<len; i++) {
				let row =[];
				let inrow = data[i];
				if(filter) {
					//ro = ro.__unsafeSet(inrow,i);
					if(!filter(ro.__unsafeSet(inrow,i)) ) continue;
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
	/**
	 * select a more convinient interface to project
	 * The primary diffenrence is the setting of new columns or adding new columns has 
	 * been made more convinient
	 *
	 *  Example of setting columns
	 *   ['column', 
	 *   	'oldColumn=newColumnName', 
	 *   	['oldCol1=newColName1', (v,ro) => some-operation],
	 *   	['newCol', someValue],
	 *   	['newCol2', (v,ro) => someComputedValue]
	 *   ]
	 * 
	 * @param  {[type]} columns [description]
	 * @param  {[type]} where   this is a filter function similar to SQL select ... from table where expr
	 * @return {[type]}         [description]
	 */
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
		let mapper = cols
			.filter(([ , ,fn]) => fn !== undefined)
			.map(([ ,nn,fn]) => [nn, toFunc(fn)]);
			
		let colMap = undefined;
		if(mapper.length) colMap = zipToDict(mapper);
		
		return this.project(
			cols.map(([oldName, newName]) => oldName+'='+newName),
			colMap, 
			where);

	}
	/**
     * Rename columns, format for which [ 'oldColumnName=newColumnName' ...]
     * @param  {[string]} list Array of strings
     * @return {Frame}      A new Frame with the renamed columns, since these are immutable data structures all unmodified data are shared with the original frame
     */
	rename(list) {
		if( !list || !arrOfStr(list)) {
			throw new TypeError('Expected a list of strings');
		}
		let pairs = zipToDict(list.map(name => name.split('=')));
		let notPresent = arrRemove(Object.keys(pairs), this.columns);
		if(notPresent.length) {
			throw new Error('These column name(s) not found in frame '+JSON.stringify(notPresent));
		}
		let cols = this.columns.map(name => pairs[name]? `${name}=${pairs[name]}`: name);
		return this.select(cols);
	}
	/**
	 * Convinience method as an alias for the __project__ method
	 * @param  {Object}  mapper Is an object with the keys being the column name to and the value is an update function or a constant
	 * @param  {function}  filter Optional filter function that will only keep rows if the filter function returns true, the filter operates on the original row not the result of the update
	 * @param  {function}  tester Optional tester function on the original row, if it returns true the update is performed other no update is done to the row
	 * @return {Frame}         A new Frame is created with the updated rows base on the mapper filter and tester
	 */
	update(mapper,filter,tester) {
		return this.project(undefined,mapper,filter,tester);
	}

	/**
	 * Returns a function that can be used iteratively to project one array to another.
	 * This is 
	 * @param  {Array}  colsMapping [description]
	 * @param  {Object}  mappingObj  [description]
	 * @return {Function}            mapping function (inputArray, outputArray) rearranges the input array to the output array
	 */
	trProject(colsMapping,mappingObj) {
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
				(inrow, row,ix=0) => {
					let fn;
					const push = ( row === undefined) ? 
						( v => row.push(v)) :
						( (v,j) => row[j] = v );
					row = row || [];
					for(let j=0; j<len2; j++) {
						let pos = ixList[j]|0;
						let v = pos === -1?'': inrow[pos];
						if( (fn = colMapFn[j]) !== undefined) {
							v = fn(v, this._rowObj(inrow), ix, inrow);
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
	 * @param  {Function} fn function to compare 2 rows a and b 
	 * @param  {[type]}   aFrame
	 * @return {[type]}
	 */
	_genAuxJoinFilter(fn,aFrame) {
		let self = this;
		if( fn === undefined ) return fn;
		let roSelf = self._rowObj(),
			roAFrame = aFrame._rowObj();
		return function(a,b) {
			if( Array.isArray(a) && Array.isArray(b) ) return fn(roSelf.__unsafeSet(a), roAFrame.__unsafeSet(b));
			return fn(a,b);
		};
	}

	/**
	 * This is like SQL innerJoin join the rows where value of colFromThis == 
	 * @param  {Frame} rightFrame    the frame to join against
	 * @param  {Array} colsToMap array of array of (strings) representing column names '1.colName' or '2.colName' 
	 * @param  {string} joinOn    'colFromThis==colFrom_aFrame'
	 * @param  {Function} filter    filter(rowObjectFronLeftFtame, rowObjectFromRightFlame) if true the join is possible
	 * @return {Frame}           [description]
	 */
	innerJoin(rightFrame, colsToMap, joinOn, filter) {
		return innerJoin(this,rightFrame, colsToMap, joinOn, this._genAuxJoinFilter(filter,rightFrame));
	}


	/**
	 * leftJoin similar to sql left join, it is like innerJoin but all the rows of the 'this' are prensnt in the output
 	 * @param  {Frame} rightFrame    the frme to join against
	 * @param  {Array} colsToMap array of (strings) representing column names '1.colName' or '2.colName' 
	 * @param  {string} joinOn    'colFromThis==colFrom_rightFrame'
	 * @param  {function} filter    [description]
	 * @return {Frame}           [description]
	 */
	leftJoin(rightFrame, colsToMap, joinOn, filter) {
		return leftJoin(this,rightFrame, colsToMap, joinOn, this._genAuxJoinFilter(filter,rightFrame));
	}

	/**
	 * Like leftJoin, but all th rows of both the left frame (this) and rightFrame ar present in the output
	 * @param  {Frame} rightFrame    [description]
	 * @param  {Array} colsToMap array of array of (strings) representing column names '1.colName' or '2.colName' 
	 * @param  {string} joinOn    'colFromThis==colFrom_aFrame'
	 * @param  {function} filter    [description]
	 * @return {Frame}           [description]
	 */
	outerJoin(rightFrame, colsToMap, joinOn, filter) {
		return outerJoin(this,rightFrame, colsToMap, joinOn, this._genAuxJoinFilter(filter,rightFrame));
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
	/**
	 * The default behavior of this method is to convert numeric strings into and return
	 * a new frame will the converted data. It tries to reuse as much of the data as possible
	 * 
	 * If a conversion list is supplied, each element of the list consists of the following
	 *    [ 
	 *    	testFunc(aValue) -- This takes a value a returns true or false
	 *    	convertFn(aValue) -- and returns the new value
	 *    ]
	 * for each cell we apply the testFunc if false then try the next testFunc in the list
	 * if the testFunc return true, the apply the convertFn to the cell value to the new value
	 * if non of the testFn succeeds then the cell remains unchanged
	 * 
	 * @param  {[[testFn, convertFn]...} convList this parameter is optional 
	 * @return {Frame}          returns a new Frame with the converted values
	 */
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
	

	/**
	 * Return a string represent of the frame formatted as an HTML table
	 * @return {[type]} [description]
	 */
	_toHtml() {
		return toHTML(this);
	}

	toString() {
		return frameToString(this);
	}


}

function toString(x) {
	return x.toString();
}

Frame.HTMLFormat = {	
	number: toString,
	other: toString
};

/**
 * frameFromString - create a frame from a string buffer usually read in from a file representing 
 * @type {[type]}
 */
Frame.frameFromString = frameFromString;
Frame.union = unionFrame;
