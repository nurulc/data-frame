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

import newArray from './newArray';

/**
 * filter an attar and return the index found
 * @param  {Function} fn  	testing function for the filter
 * @param  {[any]}   arr 	array of items to filter
 * @return {[integre]}      return an array of indexex
 */
export function filterIX(fn,arr) {
	let ln = arr.length;
	let res = newArray(ln,0);
	let j = 0;
	for (let i = 0; i < ln; i++) {
		if (fn(arr[i])) res[j++] = i;
	}
	res.length = j;
	return res;	
}


