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
 * Computes the set difference between two sorted arrays (sets), `fromSet` and `elementsToRemove`.
 * Assumes both inputs are sorted in ascending order and contain no duplicate elements (i.e., they are valid sets).
 *
 * @param {Array<any>} fromSet - The sorted array representing the set to subtract from.
 * @param {Array<any>} elementsToRemove - The sorted array representing the set of elements to remove.
 * 
 * @returns {Array<any>} - A new sorted array representing the set difference: all elements in `fromSet` 
 * that are not in `elementsToRemove`.
 *
 * @throws {TypeError} - Throws an error if either `fromSet` or `elementsToRemove` is not an array.
 *
 * @description
 * This function performs a set subtraction (`fromSet - elementsToRemove`) using a two-pointer approach for efficiency.
 * The time complexity is **O(n + m)**, where `n` is the size of `fromSet` and `m` is the size of `elementsToRemove`.
 *
 * @example
 * const result = subtract([1, 2, 3, 4], [2, 4]);
 * console.log(result); // [1, 3]
 *
 * @example
 * const result = subtract([1, 3, 5, 7], [2, 4, 6]);
 * console.log(result); // [1, 3, 5, 7]
 *
 * @example
 * const result = subtract([1, 2, 3], []);
 * console.log(result); // [1, 2, 3]
 *
 * @example
 * const result = subtract([], [1, 2, 3]);
 * console.log(result); // []
 */
export default function subtract(fromSet, elementsToRemove) {
    if (!Array.isArray(fromSet) || !Array.isArray(elementsToRemove)) {
        throw new TypeError('Both arguments must be arrays.');
    }

    const result = [];
    let i = 0, j = 0;
    const fromLen = fromSet.length;
    const removeLen = elementsToRemove.length;

    while (i < fromLen) {
        const fromElement = fromSet[i];
        const removeElement = elementsToRemove[j];

        if (j >= removeLen || fromElement < removeElement) {
            // Add element if it's not in `elementsToRemove`
            result.push(fromElement);
            i++;
        } else if (fromElement > removeElement) {
            // Move the `elementsToRemove` pointer forward
            j++;
        } else {
            // Element matches; skip it
            i++;
            j++;
        }
    }

    return result;
}



//subtract([1,2,3,4],[2,3,9])  -> [1,4]  


