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

import memoize from './objutils/memoize';

/**
 * An empty, frozen array that cannot be modified.
 * Used as a default placeholder value for array variables.
 * 
 * @constant {Array}
 */
export const EMPTY_ARRAY = Object.freeze([]);

/**
 * An empty string used as a default placeholder value.
 * 
 * @constant {string}
 */
export const EMPTY_STR = '';

/**
 * A string representing the number zero.
 * Useful as a default string value for numerical inputs.
 * 
 * @constant {string}
 */
export const ZERO_STR = '0';

/**
 * A string representing zero in decimal format.
 * Used as a default value for formatted decimal strings.
 * 
 * @constant {string}
 */
export const ZERO_DECIMAL = '0.0';

/**
 * A separator string used for separating values in a list.
 * Commonly used for joining strings in human-readable formats.
 * 
 * @constant {string}
 */
export const SEPARATOR_STRING = ', ';

/**
 * A function that always returns `true`.
 * Can be used as a default callback for conditions where a truthy result is needed.
 * 
 * @function
 * @returns {boolean} Always returns `true`.
 */
export const TRUE = () => true;

/**
 * A function that always returns `false`.
 * Can be used as a default callback for conditions where a falsy result is needed.
 * 
 * @function
 * @returns {boolean} Always returns `false`.
 */
export const FALSE = () => false;

/**
 * A function that returns a constant value `k`.
 * Memoizes the provided constant `k` and returns a function that always outputs this value.
 * 
 * @function K
 * @param {*} k - The constant value to be returned.
 * @returns {Function} A function that always returns the constant value `k`.
 */
export const K = memoize(k => () => k);

/**
 * A higher-order function that negates the result of the provided function.
 * Returns a function that calls `f` with the provided arguments and returns the opposite boolean value.
 * 
 * @function NOT
 * @param {Function} f - The function whose result will be negated.
 * @returns {Function} A function that returns the negated result of `f`.
 * 
 * @example
 * const isNotEmpty = NOT(isEmpty);
 * isNotEmpty([]); // false, since `isEmpty([])` is true
 */
export const NOT = (f) => (...args) => !f(...args);

/**
 * A higher-order function that returns the logical AND of two functions.
 * Takes two functions (`f1` and `f2`) and returns a function that calls both with the provided arguments.
 * The returned function returns `true` if both `f1` and `f2` return `true`, otherwise `false`.
 * 
 * @function AND
 * @param {Function} f1 - The first function to evaluate.
 * @param {Function} f2 - The second function to evaluate.
 * @returns {Function} A function that returns the logical AND of `f1` and `f2`.
 * 
 * @example
 * const isNonEmptyString = AND(isString, NOT(isEmpty));
 * isNonEmptyString("Hello"); // true
 * isNonEmptyString(""); // false
 */
export const AND = (f1, f2) => (...args) => f1(...args) && f2(...args);

/**
 * A higher-order function that returns the logical OR of two functions.
 * Takes two functions (`f1` and `f2`) and returns a function that calls both with the provided arguments.
 * The returned function returns `true` if either `f1` or `f2` returns `true`.
 * 
 * @function OR
 * @param {Function} f1 - The first function to evaluate.
 * @param {Function} f2 - The second function to evaluate.
 * @returns {Function} A function that returns the logical OR of `f1` and `f2`.
 * 
 * @example
 * const isStringOrArray = OR(isString, isArray);
 * isStringOrArray([]); // true
 * isStringOrArray("Test"); // true
 * isStringOrArray(42); // false
 */
export const OR = (f1, f2) => (...args) => f1(...args) || f2(...args);
