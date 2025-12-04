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

import {strHash} from '../../string/strdict';
/**
 * Generates a hash value for an array by combining the hash values of its elements.
 *
 * @param {Array} arr - The input array for which the hash value is calculated. 
 * Each element of the array should be compatible with the `strHash` function.
 * 
 * @returns {number} - A numeric hash value for the input array.
 *
 * @example
 * const hash = arrHash(['apple', 'banana', 'cherry']);
 * console.log(hash); // Example output: 123456
 *
 * @requires strHash - This function depends on the `strHash` function to compute hash values for individual elements of the array.
 */
export default  function arrHash(arr) {
	let len = arr.length;
	let hash = 0;
	for(let i=0; i<len;i++) {
		hash=(hash*13|0)+(strHash(arr[i])|0);
	}
	return hash;
}

