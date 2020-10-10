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

import { vecAdd, arrHash } from '../array';
import arrEqual from '../array/arrEQ';

const EMPTY_ARRAY = [];
/**
 *  Used to from the base class for a Frame,
 *  This is added to break circular import reference from hasFrame(aFrame) function
 *  Originally hasFrame imported frame and frame imported hasFrame. In order to break taht up
 *  we now include BaseFrame from both Frame and hasFrame.
 *  
 */
export default class BaseFrame {
	/**
	 * [constructor description]
	 * @param  {[type]} data    [description]
	 * @param  {[type]} columns [description]
	 * @param  {[type]} name    [description]
	 * @param  {[type]} keyFunc [description]
	 * @return {[type]}         [description]
	 */
	constructor(data,columns,name,keyFunc) {
		this.data = data||[];
		this._columns = columns||[];
		this._name = name || 'frame';
		this._keyFunc = keyFunc;
	
		this._key = -1; 
		if(keyFunc && !typeof keyFunc !== 'string' ) {
			this._key = this._columns.indexOf(keyFunc);
			this.keyFunc = this._getKey;
		} else if(typeof keyfunc === 'function') {
			this.keyFunc = keyFunc;
			let keyName = this.keyFunc();
			if(typeof keyName === 'string') {
				this._key = this._columns.indexOf(keyName);
			}
		}
		else  this.keyFunc = this._getKey;		
	}

	/**
	 * Create a new frame based of this frame but with new data
	 * @param {[[string]]} d    new data for the frame (but with the same columns
	 * @param {String} name optional ne name
	 */
	setData(d,name) {
		return new this.constructor(d, this.columns, name || this.name, this._keyFunc);
	}

	_getKey(i) {
		return this.data[i][this._key <0 ?0: this._key];
	}

	keyName() {
		if(this._key < 0 ) return undefined;
		return this.columns[this._key];
	}

	/**
	 * [getKey description]
	 * @param  {[type]} i [description]
	 * @return {[type]}   [description]
	 */
	getKey(i) {
		return this.keyFunc(i);
	}

	setKey(keyFunc) {
		return new this.constructor(this.data, this.columns, this.name, keyFunc);
	}

	/**
	 * [columns description]
	 * @return {[type]} [description]
	 */
	get columns() { return this._columns||EMPTY_ARRAY; }
	setColumns(columns) {
		return new this.constructor(this.data, columns, this.name, this._keyFunc);
	}
	get length() { return (this.data || EMPTY_ARRAY).length; }
	get name() { return this._name; }
	setName(aName) {
		return new this.constructor(this.data, this.columns, aName, this._keyFunc);
	}
	get hash() {
		if( this._hash !== -1 ) return this._hash;
		return this._hash = this.data.reduce((h,arr) => (h*17|0)+arrHash(arr), 0);
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
		return new this.constructor(this.data.map( v => [v[ix]]), [this._columns[ix]], this._name, this._keyFunc);
	}

	/**
	 * rawColumn get the column given by the 'colName'
	 * 
	 * @param  {string} colName name of a column of the frame;
	 * @return {[any]}         array representing the values of a column identified by colName
	 */
	rawColumn(colName) {
		const ix = this._columns.indexOf(colName);
		if( ix == -1 ) return [];
		return this.data.map( v => v[ix]);
	}

	/**
	 * Get the row vector 
	 * @param  {number} ix the index number of a row
	 * @return {[any]}    the row aray for index 'ix'
	 */
	row(ix) { return this.data[ix]; }


	/**
	 * Similar functionality to array slice
	 * @param  {number} first start index
	 * @param  {number} last  the last index + 1 of the data
	 * @return {Frame}       new frame representing the subset of the rows between firsr and last (excluding position last)
	 */
	slice(first,last) {
		return new this.constructor(this.data.slice(first,last), this.columns, this._name, this._keyFunc);
	}

	/**
	 * Array of column names the are predominantly numeric, the values may be number or number like staring
\	 * @return {[string]}        array of column names that are predominantly numeric
	 */
	numericColumns() {
		let threshold = Math.trunc(this.length*0.9);
		let a = this.data.map(row => row.map(v => (isNum(v))?1:(v === '' || v === undefined )? 0.5 : 0));
		let sums = a.reduce(vecAdd,undefined); 
		return this.columns.map((c,i) => (sums[i]>threshold) ? c :undefined).filter(x => x);
	}
 
	/**
	 * An arry of strings, where the string the is a list of tab seperated column values
	 * @return {[string]} each element of the array is an string represention of a corresponding row 
	 */
	asStrList() {
		return this.data.map(x => x.join('\t'));
	}

	/**
	 * [description]
	 * @param  {function} fn 	takes function(row:array, ix, array)
	 * @return {[type]}     [description]
	 */
	forEachRaw(fn) { this.data.forEach( (row,ix,arr) => fn(row,ix,arr)); }

	/**
	 * This is the functional equivenent of Array.map for a Frame
	 * @param  {Function} fn       [description]
	 * @param  {[string]}   newCols [description]
	 * @return {Frame}            map each row of the frame through 'fn' to get a new frame
	 */
	mapRaw(fn,newCols) { return new this.constructor(this.data.map(fn), newCols || this._columns, this._name, this._keyFunc); }
	
	/**
	 * [description]
	 * @param  {function} fn 	filter function to apply to a row  if returns true keep the row otherwise discard the row
	 * @param  {string|function]} keyFunc 	the key column name, or thekey computing function
	 * @return {[type]}     [description]
	 */
	filterRaw(fn,keyFunc) { return new this.constructor(this.data.filter(fn),this._columns, this._name, this._keyFunc); }

	/**
	 * Basically this is the equivelat to reduce performed on the data array, this is an array of rows as the elemnt passed to reduc
	 * @param  {Function} fn   [description]
	 * @param  {any}   ini  the starting value for reduce
	 * @return {any}        the type is the return type of the fuction 'fn'
	 */
	reduceRaw(fn, ini) { return this.data.reduce( fn, ini); }
}