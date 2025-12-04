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
 * Computes the sum of the results of applying a transformation function to each element of an array.
 * The function is curried, allowing flexible invocation patterns.
 *
 * @param {Function} fn - A transformation function that takes an element of the array and returns a number.
 * @param {Array} arr - The array of elements to be processed. Can also be supplied via currying.
 * 
 * @returns {number} - The sum of the transformed elements. Returns 0 if the array is empty.
 *
 * @throws {TypeError} - Throws an error if `fn` is not a function or `arr` is not an array.
 *
 * @example
 * // Direct invocation
 * const result = arrSum(x => x * 2, [1, 2, 3]);
 * console.log(result); // 12 (1*2 + 2*2 + 3*2)
 *
 * // Curried invocation
 * const sumDouble = arrSum(x => x * 2);
 * console.log(sumDouble([1, 2, 3])); // 12
 *
 * @example
 * const result = arrSum(x => x, [5, 10, 15]);
 * console.log(result); // 30 (5 + 10 + 15)
 */
export default  arrCurry(function(fn,arr) {
	if (arr.length === 0)
		return 0;
	var result = fn(arr[0]);
	for (var i = 1; i < arr.length; i++)
		result += fn(arr[i]);
	return result;
});

