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
 * Adds two vectors (arrays) element-wise, handling cases where one or both vectors may be undefined.
 * If one vector is undefined, the other is returned as a shallow copy.
 * If vectors are of different lengths, missing elements are treated as 0.
 *
 * @param {Array<number>} [a1] - The first vector. Can be undefined.
 * @param {Array<number>} [a2] - The second vector. Can be undefined.
 * 
 * @returns {Array<number>|undefined} - The element-wise sum of the two vectors.
 * If both vectors are undefined, returns `undefined`.
 * If only one vector is defined, returns a shallow copy of that vector.
 *
 * @throws {TypeError} - Throws an error if either argument is defined but not an array of numbers.
 *
 * @example
 * const result = vecAdd([1, 2, 3], [4, 5]);
 * console.log(result); // [5, 7, 3]
 *
 * const resultWithOneVector = vecAdd(undefined, [4, 5, 6]);
 * console.log(resultWithOneVector); // [4, 5, 6]
 *
 * const resultWithNoVectors = vecAdd(undefined, undefined);
 * console.log(resultWithNoVectors); // undefined
 */
export default function vecAdd(a1, a2) {
    // Validate inputs if defined
    if (a1 !== undefined && (!Array.isArray(a1) || !a1.every(num => typeof num === 'number'))) {
        throw new TypeError('Invalid argument: a1 must be an array of numbers or undefined.');
    }
    if (a2 !== undefined && (!Array.isArray(a2) || !a2.every(num => typeof num === 'number'))) {
        throw new TypeError('Invalid argument: a2 must be an array of numbers or undefined.');
    }

    // Handle undefined cases
    if (a1 === undefined) {
        return a2 ? a2.slice() : undefined;
    }
    if (a2 === undefined) {
        return a1 ? a1.slice() : undefined;
    }

    // Ensure element-wise addition with handling for different lengths
    const maxLength = Math.max(a1.length, a2.length);
    const result = new Array(maxLength);

    for (let i = 0; i < maxLength; i++) {
        const value1 = a1[i] || 0;
        const value2 = a2[i] || 0;
        result[i] = value1 + value2;
    }

    return result;
}


