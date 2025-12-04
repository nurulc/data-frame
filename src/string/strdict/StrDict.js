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

/**
 * [EMPTY_STR description]
 * @type {String}
 */
const EMPTY_STR = '';

/**
 * A custom string dictionary class optimized for storing and retrieving strings using hashing.
 * This class maintains a dictionary of strings with a fixed maximum length and handles string collision
 * and expansion of the dictionary as needed. It provides methods to retrieve, store, and expand the dictionary.
 */
export class StrDict {
    /**
     * Initializes a new instance of the StrDict class with a specified maximum length.
     * The dictionary is implemented using two parallel arrays: one for storing hash values and another for storing strings.
     *
     * @constructor
     * @param {number} maxLen - The maximum length of the dictionary. Defaults to 1997 if not provided.
     */
	constructor(maxLen) {
		let len = (maxLen || 1997)|0;
		this.dictI = new Array(len);  
		this.dictV = new Array(len);
		this.length = 0;
		for(let i=0; i<len; i++) {
			this.dictI[i] = 0;
			this.dictV[i] = EMPTY_STR;
		}
		
	}
    /**
     * Retrieves a substring from the dictionary or adds it if not found.
     * This method checks if a substring (specified by `start` and `end` indices) exists in the dictionary.
     * If found, it returns the stored string; if not, it adds the substring to the dictionary and returns it.
     *
     * @param {string} str - The input string from which a substring will be checked.
     * @param {number} [start=0] - The starting index of the substring (inclusive).
     * @param {number} [end=str.length] - The ending index of the substring (exclusive).
     * @param {string} [valStr] - Optional. If provided, this value will be stored in the dictionary instead of the actual substring.
     * @returns {string} The stored string if found, or the newly added string if not found.
     * @throws {Error} Throws an error if the substring is not found in the dictionary.
     */
	get(str, start, end, valStr) { 
		// always return a string, if it is not in the dictionary then add it, valStr is only used during expand
		//throw new Error("not implementes");
		
		start = (start || 0) | 0;
		end = (end || str.length) | 0;
		if( start === end) return EMPTY_STR;
		let hx = strHash(str, start,end);
		let dictI = this.dictI, dictV = this.dictV;
		let len = dictI.length;
		let ix = hx % len;
		// while( dictI[ix] ) {
		//   if( dictI[ix] === hx && strEq(str,start,end, dictV[ix]) ) return dictV[ix];
		//   ix = (ix + 1) % len;
		// }
		let s,vx;
		let slen = end-start;
		while( vx = dictI[ix] ) {
			check: {
				if( vx === hx ) {
					let otherStr = dictV[ix];
					let ol = otherStr.length | 0;
					if( slen !== ol) { ix = (ix + 1) % len; continue }
					
					for(let i=start; i<end; i++) {
						if( str[i] !== otherStr[i-start]) break check;
					}
					//if( i === end ) 
					return dictV[ix];
				}
			}
			ix = (ix + 1) % len;
		}
		if( !vx ) {
			dictI[ix] = hx;
			dictV[ix] = valStr !== undefined ? valStr : str.substring(start,end);
			this.length++;
			let rStr = dictV[ix];
			if( this.length > len * 0.8 ) this.expand();
			return rStr;
		} 
		throw new Error("str: "+str.substring(start,end) + " not found");
	}
    /**
     * Retrieves an entire string from the dictionary, or adds it if not found.
     * This method checks if the input string exists in the dictionary.
     * If found, it returns the stored string; if not, it adds the string to the dictionary and returns it.
     *
     * @param {string} str - The string to be retrieved or added to the dictionary.
     * @returns {string} The stored string if found, or the newly added string if not found.
     * @throws {Error} Throws an error if the string is not found in the dictionary.
     */
	getV(str) {
		if(!str) return str;
		let hx = strHash(str, 0,str.length);
		let dictI = this.dictI, dictV = this.dictV;
		let len = dictI.length;
		let ix = hx % len;
		let end = str.length;
		let s,vx;
		while( vx = dictI[ix] ) {
			if( vx === hx && str === dictV[ix] ) return dictV[ix];
			ix = (ix + 1) % len;
		}
		if( !vx ) {
			dictI[ix] = hx;
			dictV[ix] = str;
			this.length++;
			let rStr = dictV[ix];
			if( this.length > len * 0.8 ) this.expand();
			return rStr;
		} 
		throw new Error("str: "+str + " not found");
	}

    /**
     * Expands the size of the dictionary when the current dictionary reaches its capacity.
     * The method doubles the size of the current dictionary and rehashes all existing strings.
     *
     * @returns {void}
     */
	expand() {
		let len = this.dictI.length;
		let dictV = this.dictV;
		let newDict = new StrDict(this.dictI.length*2+1);
		for(let i=0; i < len; i++) {
			let str = dictV[i];
			if(str) newDict.getV(str);
		} 
		this.dictI = newDict.dictI;
		this.dictV = newDict.dictV;
		this.length = newDict.length;
	}
    /**
     * Retrieves all stored values in the dictionary.
     * This method returns all the strings stored in the dictionary, excluding empty slots.
     *
     * @returns {Array<string>} An array of all strings stored in the dictionary.
     */
	values() {
		return this.dictV.filter(x => x);
	}
}
