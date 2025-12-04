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
 * Counts the number of elements in an array that satisfy a given test function.
 * The function is curried, allowing flexible invocation patterns.
 *
 * @param {Function} testFn - A predicate function that takes an element of the array and returns `true` if the element satisfies the condition, otherwise `false`.
 * @param {Array} arr - The array of elements to be tested. Can also be supplied via currying.
 * 
 * @returns {number} - The count of elements that satisfy the test function.
 *
 * @throws {TypeError} - Throws an error if `testFn` is not a function or `arr` is not an array.
 *
 * @example
 * // Direct invocation
 * const result = arrCount(x => x > 2, [1, 3, 5, 2]);
 * console.log(result); // 2 (elements 3 and 5 satisfy the condition)
 *
 * // Curried invocation
 * const countGreaterThanTwo = arrCount(x => x > 2);
 * console.log(countGreaterThanTwo([1, 3, 5, 2])); // 2
 *
 * @example
 * const result = arrCount(x => typeof x === 'string', [1, 'hello', 3, 'world']);
 * console.log(result); // 2
 * The above looks even better as: arrCount(isString, [1, 'hello', 3, 'world']) // 2
 */
export default  arrCurry(
	function(testFn,arr) {
		let len = arr.length;
		let count = 0;
		for(let i=0; i<len; i++) {
			if(testFn(arr[i])) count++;
		}
		return count;
});
