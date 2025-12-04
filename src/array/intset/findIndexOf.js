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
 * Finds the index of a specified element in a sorted array using binary search.
 *
 * @param {Array<any>} aSet - A sorted array to search within. The array must be sorted in ascending order.
 * @param {any} searchElement - The element to search for in the array.
 * 
 * @returns {number} - The index of `searchElement` in the array if found; otherwise, returns `-1`.
 *
 * @throws {TypeError} - Throws an error if `aSet` is not an array.
 *
 * @description
 * This function uses the binary search algorithm, optimized for speed. It repeatedly divides the search range in half
 * until the element is found or the range is empty. The time complexity of binary search is **O(log n)**, making it
 * efficient for large sorted arrays.
 *
 * @example
 * const sortedArray = [1, 3, 5, 7, 9];
 * const index = findIndexOf(sortedArray, 5);
 * console.log(index); // 2
 *
 * @example
 * const sortedArray = [1, 3, 5, 7, 9];
 * const index = findIndexOf(sortedArray, 2);
 * console.log(index); // -1
 *
 * @example
 * const sortedArray = [];
 * const index = findIndexOf(sortedArray, 10);
 * console.log(index); // -1
 */
export default function findIndexOf(aSet, searchElement) {
    if (!Array.isArray(aSet)) {
        throw new TypeError('Invalid argument: aSet must be an array.');
    }

    let minIndex = 0;
    let maxIndex = aSet.length - 1;

    while (minIndex <= maxIndex) {
        // Optimized division by 2 using right shift
        const currentIndex = (minIndex + maxIndex) >> 1; 
        const currentElement = aSet[currentIndex];

        // Check for match, adjust range based on comparison
        if (currentElement === searchElement) {
            return currentIndex; // Element found
        } else if (currentElement < searchElement) {
            minIndex = currentIndex + 1;
        } else {
            maxIndex = currentIndex - 1;
        }
    }

    return -1; // Element not found
}







