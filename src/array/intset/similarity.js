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
 * Computes the similarity between two sorted arrays.
 * Returns the count of common elements and the count of differences between the arrays.
 *
 * @param {Array<any>} sortedA - The first sorted array.
 * @param {Array<any>} sortedB - The second sorted array.
 * 
 * @returns {Array<number>} - An array where:
 * - The first element is the count of common elements between the two arrays.
 * - The second element is the number of differences between the two arrays, calculated as `lenA + lenB - 2 * same`.
 *
 * @example
 * const result = similarity([1, 2, 3], [2, 3, 4]);
 * console.log(result); // [2, 2] (2 common elements, 2 differences)
 *
 * @example
 * const result = similarity([1, 3, 5], [2, 4, 6]);
 * console.log(result); // [0, 6] (0 common elements, 6 differences)
 *
 * @example
 * const result = similarity([], []);
 * console.log(result); // [0, 0] (0 common elements, 0 differences)
 */
export default function similarity(sortedA, sortedB) {
    let j = 0;
    const lenA = sortedA.length;
    const lenB = sortedB.length;
    let same = 0;

    for (let i = 0; i < lenA && j < lenB; i++) {
        const iA = sortedA[i];
        if (iA === sortedB[j]) {
            same++;
            j++;
        } else {
            while (j < lenB && iA > sortedB[j]) j++;

            if (j === lenB) break;
            if (iA === sortedB[j]) {
                same++;
                j++;
            }
        }
    }

    return [same, lenA + lenB - 2 * same];
}


