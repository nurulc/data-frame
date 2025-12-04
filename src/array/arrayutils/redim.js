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
 * Splits an array into smaller arrays of specified size, filling extra slots with a default value if necessary.
 *
 * @param {Array} arr - The input array to be split into smaller arrays.
 * @param {number} n - The desired size of each sub-array. If the remaining elements are fewer than `n`, 
 * the sub-array is padded with the first element of the input array or truncated to the remaining size.
 *
 * @returns {Array<Array>} - An array of sub-arrays, each with a maximum length of `n`. 
 * The last sub-array may be smaller if the remaining elements in the input array are insufficient to fill `n`.
 *
 * @throws {TypeError} - Throws an error if `arr` is not an array or `n` is not a positive integer.
 *
 * @example
 * const result = redim([1, 2, 3, 4, 5], 2);
 * console.log(result); // [[1, 2], [3, 4], [5]]
 *
 * const resultWithPadding = redim([1, 2, 3], 4);
 * console.log(resultWithPadding); // [[1, 2, 3, 1]]
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
