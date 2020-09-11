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
 * @param  {[any]} arr
 * @param  {number} n
 * @return {[type]}
 */
export default  function redim(arr, n) {
	let result = [];
	let len = arr.length;
	let len_n = len+n-1;
	let _v = arr[0];
	for (var i = 0; i < len_n; i += n) {
		if(len-i <= 0) break;
		var r = newArray(Math.min(n, len-i), _v);
		var j=0;
		for(; j<n && i+j<len; j++) {
			r[j] = arr[i+j];
		}
		r.length = j;
		result.push(r);
	}
	return result;
}
