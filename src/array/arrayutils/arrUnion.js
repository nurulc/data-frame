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

import isArray from '../../utils/types/isArray';

/**
 * Computes the union of multiple arrays, ensuring unique elements in the result.
 *
 * @param {...Array} arrays - The arrays to compute the union from. Each argument should be a valid array.
 * 
 * @returns {Array} - An array containing the union of all input arrays with unique elements.
 *
 * @throws {TypeError} - Throws an error if any argument is not a valid array.
 *
 * @example
 * const result = arrUnion([1, 2, 3], [2, 3, 4], [4, 5]);
 * console.log(result); // [1, 2, 3, 4, 5]
 */
export default function arrUnion(...arrays) {
    if (!arrays.every(isArray)) {
        throw new TypeError('Invalid argument, Please pass proper array arguments');
    }

    const uniqueElements = new Map();
    const result = [];

    for (const arr of arrays) {
        for (const element of arr) {
            if (!uniqueElements.has(element)) {
                uniqueElements.set(element, true);
                result.push(element);
            }
        }
    }

    return result;
}


