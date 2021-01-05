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

import newArray from '../../array/arrayutils/newArray';
import setKey from './setKey';
import {isA} from './isA';
/**
 * genObjMapper generates a function to map object to an array
 * this is useful to convert an array of object to the data of a frame
 * @param  {Object|Array} obj provides a list of keys to use
 * @return {[mapperFunction, [keys]]}     returns an array first element that function to convert the object to an array, and the secont element is an array of column names
 */
export default function genObjMapper(obj) {
	let keys = iasA.array(obj) ? obj : Object.keys(obj);
	let mapper = keys.reduce((o,v,ix) => setKey(o,v,ix), {});
	let len = keys.length;
	return [ //mapper func, colm array
		(obj) => {
			let arr = newArray(len,null);
			for(let i=0; i<len; i++) {
				let k = keys[i];
				arr[mapper[k]] = obj[k];
			}
			return arr;
		}, 
		keys
	] ;
}

// 