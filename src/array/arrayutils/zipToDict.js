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
 * Converts a list of key-value pairs into an object (dictionary).
 * Ensures that there are no duplicate keys in the input.
 *
 * @param {Array<[string, any]>} aListOfPairs - An array of key-value pairs, where each pair is an array [key, value].
 * 
 * @returns {Object} - An object constructed from the key-value pairs.
 *
 * @throws {Error} - Throws an error if there are duplicate keys in the input.
 *
 * @example
 * const pairs = [['a', 1], ['b', 2]];
 * const result = zipToDict(pairs);
 * console.log(result); // { a: 1, b: 2 }
 *
 * @example
 * const pairs = [['a', 1], ['b', 2], ['a', 3]];
 * zipToDict(pairs); // Throws Error: duplicate key: a
 */
export function zipToDict(aListOfPairs) {
    const dict = {};
    for (const [k, v] of aListOfPairs) {
        if (dict[k] !== undefined) {
            throw new Error(`duplicate key: ${k}`);
        }
        dict[k] = v;
    }
    return dict;
}

/**
 * Converts an object (dictionary) into an array of key-value pairs, without sorting the keys.
 *
 * @param {Object} aDict - The object to be converted.
 * 
 * @returns {Array<[string, any]>} - An array of key-value pairs, where each pair is an array [key, value].
 *
 * @example
 * const dict = { a: 1, b: 2 };
 * const result = dictToZipB(dict);
 * console.log(result); // [['a', 1], ['b', 2]]
 */
export function dictToZipB(aDict) {
    return Object.entries(aDict);
}

/**
 * Converts an object (dictionary) into a sorted array of key-value pairs, sorted by keys in ascending order.
 *
 * @param {Object} aDict - The object to be converted.
 * 
 * @returns {Array<[string, any]>} - A sorted array of key-value pairs, where each pair is an array [key, value].
 *
 * @example
 * const dict = { b: 2, a: 1 };
 * const result = dictToZip(dict);
 * console.log(result); // [['a', 1], ['b', 2]]
 */
export function dictToZip(aDict) {
    return Object.entries(aDict).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
}


