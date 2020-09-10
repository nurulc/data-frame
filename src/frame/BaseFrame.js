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

import { vecAdd, arrHash} from '../array';
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
		this.keyFunc = keyFunc || this._getKey;
		this.data = data||[];
		this._columns = columns||[];
		this._name = name || 'frame';
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
		return new this.constructor(this.data.map( v => [v[ix]]), [this._columns[ix]], this._name, this.keyFunc);
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


	/**
	 * Similar functionality to array slice
	 * @param  {[type]} first [description]
	 * @param  {[type]} last  [description]
	 * @return {[type]}       [description]
	 */
	slice(first,last) {
		return new this.constructor(this.data.slice(first,last), this.columns, this._name, this.keyFunc);
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
	 * [asStrList description]
	 * @return {[type]} [description]
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
	 * [description]
	 * @param  {Function} fn   [description]
	 * @param  {[type]}   ini  [description]
	 * @return {[type]}        [description]
	 */
	reduceRaw(fn, ini) { return this.data.reduce( fn, ini); }
	
	
}