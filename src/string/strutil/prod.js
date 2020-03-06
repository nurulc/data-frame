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

import {flatten} from '../../array/flatten';
/**
 * This is rthe cross product of two arrays, where each arrys is an array of strings
 * the result is and array of length m x n, where m is the length of the first vector
 * and n is the length of the second vector
 *
 * this is like a full multiplication table where the inner operation (the multiplication) is
 * string concatination. Note if either array is a scalar string it is converted into an array
 * 
 * tring prod out, example prod(['a','b'], ['x1', 'x2']) => [ 'ax1', 'bx1', 'ax2', 'bx2' ]
 * 
 * @param  {string|[string]} s    a string or array of strings
 * @param  {[string]} list of strings
 * @return {[string]}      [description]
 */
export default  function prod(s,list) { 
	if(!Array.isArray(list)) list = list?[list]:[];
	if(Array.isArray(s)) {
		return flatten(s.map(x => prod(x,list)));
	}
	else {
		if(!s) return list.slice();
		if(list.length == 0) return [s];
		else return list.map( x => s+x);
	} 
}
