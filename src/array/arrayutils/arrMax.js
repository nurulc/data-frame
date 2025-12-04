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

import arrCurry from './arrCurry';

/**
 * Computes the maximum value of the results of applying a transformation function to each element of an array.
 * The function is curried, allowing flexible invocation patterns.
 *
 * @param {Function} fn - A transformation function that takes an element of the array and returns a number.
 * @param {Array} arr - The array of elements to be processed. Can also be supplied via currying.
 * 
 * @returns {number} - The maximum value among the transformed elements.
 *
 * @throws {TypeError} - Throws an error if `fn` is not a function or `arr` is not an array.
 * @throws {Error} - Throws an error if the array is empty.
 *
 * @example
 * // Direct invocation
 * const result = arrMax(x => x * 2, [3, 1, 4]);
 * console.log(result); // 8 (4 * 2 is the maximum)
 *
 * // Curried invocation
 * const maxDouble = arrMax(x => x * 2);
 * console.log(maxDouble([3, 1, 4])); // 8
 *
 * @example
 * const result = arrMax(x => x, [7, 2, 8, 5]);
 * console.log(result); // 8
 */

export default  arrCurry(function(fn,arr) {
	var min = fn(arr[0]);
	for (var i = 0; i < arr.length; i++) {
		min = Math.max(min,fn(arr[i]));
	}
	return min;
});


