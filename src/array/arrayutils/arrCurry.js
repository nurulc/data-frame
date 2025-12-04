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
 * Decorates an array function to support multiple invocation patterns:
 * 
 * 1. `arrayFunction(mappingFunction, array)` - Applies `mappingFunction` to each element in `array`.
 * 2. `arrayFunction(array)` - Uses an identity function (`ID`) to return the array as-is.
 * 3. `arrayFunction(mappingFunction)` - Returns a new function that accepts an array and applies `mappingFunction` to it.
 *
 * This function performs validation on inputs, supports currying, and ensures type safety.
 *
 * @param {Function} functionToDecorate - The original array function to decorate.
 * The function should take two arguments: a transformation function and an array.
 *
 * @returns {Function} - A decorated function that supports the described invocation patterns.
 *
 * @throws {TypeError} - Throws an error if the provided arguments are invalid:
 * - If `functionToDecorate` is not a function.
 * - If invalid arguments are passed during invocation.
 *
 * @example
 * // Example function to be decorated
 * const mapFunction = (fn, arr) => arr.map(fn);
 *
 * // Create the decorated function
 * const decoratedFunction = arrCurry(mapFunction);
 *
 * // Usage
 * console.log(decoratedFunction(x => x * 2, [1, 2, 3])); // [2, 4, 6]
 * console.log(decoratedFunction([1, 2, 3])); // [1, 2, 3]
 * const curried = decoratedFunction(x => x * 2);
 * console.log(curried([1, 2, 3])); // [2, 4, 6]
 */
export default function arrCurry(functionToDecorate) {
    if (typeof functionToDecorate !== 'function') {
        throw new TypeError('Invalid argument: functionToDecorate must be a function.');
    }

    return function (transformElement, arr) {
        // If transformElement is a function
        if (typeof transformElement === 'function') {
            if (arr === undefined) {
                // Currying: return a function that takes an array
                return (array) => {
                    if (!Array.isArray(array)) {
                        throw new TypeError('Invalid argument: Expected an array as input.');
                    }
                    return functionToDecorate(transformElement, array);
                };
            } else if (Array.isArray(arr)) {
                // Direct application
                return functionToDecorate(transformElement, arr);
            }
        }

        // If transformElement is an array
        if (Array.isArray(transformElement)) {
            if (arr === undefined) {
                // Use identity function and apply the array directly
                return functionToDecorate((x) => x, transformElement);
            }
        }

        // Invalid input
        throw new TypeError(
            'Invalid arguments: Expected (function, array), (array), or (function).'
        );
    };
}


/**
 * is obj a function
 * @param  {any} fun - is a object that may be a function object
 * @return {boolean} - true if it is a function, false otherwise
 */
function isFunction(fun) {
	return (typeof fun === 'function')?fun:null;
}

function ID(x) { return x; }


//

