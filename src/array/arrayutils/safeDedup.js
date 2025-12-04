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
 * Removes duplicate values from an array, preserving the original order of elements.
 *
 * @param {Array} list - The input array from which duplicates will be removed.
 * 
 * @returns {Array} - A new array containing unique elements from the input array.
 *
 * @throws {TypeError} - Throws an error if the input is not an array.
 *
 * @example
 * const result = safeDedup([1, 2, 2, 3, 4, 4]);
 * console.log(result); // [1, 2, 3, 4]
 *
 * @example
 * const result = safeDedup(['a', 'b', 'a', 'c']);
 * console.log(result); // ['a', 'b', 'c']
 */
export default function safeDedup(list) {
    if (!Array.isArray(list)) {
        throw new TypeError('Invalid argument: Input must be an array.');
    }

    const seen = new Set();
    const result = [];

    for (const item of list) {
        if (!seen.has(item)) {
            seen.add(item);
            result.push(item);
        }
    }

    return result;
}



