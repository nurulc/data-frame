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

export const isA = {
	array: isArray,
	notNull,
	func: isFunc,
	str: isStr,
	num: isNum,
	bool: isBool,
	obj: isObj,
	map: isMap,
	set: isSet,
	arrayOf
};

/**
 * isArray checks if the argument is an array
 * @param  {[any]}  arr Javascript arry of any type
 * @return {Boolean}     true of the item is an array
 */
function isArray(arr) {
		if( !arr) return undefined;
		if(Array.isArray(arr)) return arr;
		return (arr.constructor === Array)?arr:undefined;
}

/**
 * Checks if the provided object is not null or undefined.
 * If the object is neither `null` nor `undefined`, the object is returned; otherwise, `undefined` is returned.
 *
 * @function notNull
 * @param {*} obj - The object to be checked.
 * @returns {*} The object if it is not null or undefined; otherwise, returns `undefined`.
 *
 * @example
 * notNull(42); // 42
 * notNull(null); // undefined
 */
function notNull(obj) { 
    return (obj !== null && obj !== undefined) ? obj : undefined; 
}

/**
 * Checks if the provided value is a function.
 * If the value is a function, it is returned; otherwise, `undefined` is returned.
 *
 * @function isFunc
 * @param {*} fun - The value to be checked.
 * @returns {Function|undefined} The function if the value is a function; otherwise, `undefined`.
 *
 * @example
 * isFunc(() => {}); // [Function]
 * isFunc(123); // undefined
 */
function isFunc(fun) {
    return (typeof fun === 'function') ? fun : undefined; 
}

/**
 * Checks if the provided value is a string.
 * If the value is a string, it is returned; otherwise, `undefined` is returned.
 *
 * @function isStr
 * @param {*} str - The value to be checked.
 * @returns {string|undefined} The string if the value is a string; otherwise, `undefined`.
 *
 * @example
 * isStr("Hello"); // "Hello"
 * isStr(123); // undefined
 */
function isStr(str) { 
    return (typeof str === 'string') ? str : undefined; 
}

/**
 * Checks if the provided value is a number.
 * If the value is a number, it is returned; otherwise, `undefined` is returned.
 *
 * @function isNum
 * @param {*} num - The value to be checked.
 * @returns {number|undefined} The number if the value is a number; otherwise, `undefined`.
 *
 * @example
 * isNum(42); // 42
 * isNum("42"); // undefined
 */
function isNum(num) { 
    return (typeof num === 'number')
}

/**
 * Checks if the provided value is a boolean.
 * If the value is a boolean, it returns `true`; otherwise, it returns `false`.
 *
 * @function isBool
 * @param {*} val - The value to be checked.
 * @returns {boolean} `true` if the value is a boolean; otherwise, `false`.
 *
 * @example
 * isBool(true); // true
 * isBool(false); // true
 * isBool(0); // false
 * isBool("false"); // false
 */
function isBool(val) {
    return typeof val === 'boolean';
}

/**
 * Checks if the provided value is a non-array object.
 * If the value is an object (excluding arrays), it returns `true`; otherwise, it returns `false`.
 *
 * @function isObj
 * @param {*} val - The value to be checked.
 * @returns {boolean} `true` if the value is a non-array object; otherwise, `false`.
 *
 * @example
 * isObj({}); // true
 * isObj([]); // false
 * isObj(null); // false
 * isObj("string"); // false
 */
function isObj(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
}

/**
 * Checks if the provided value is an instance of `Map`.
 * If the value is a `Map`, it returns `true`; otherwise, it returns `false`.
 *
 * @function isMap
 * @param {*} val - The value to be checked.
 * @returns {boolean} `true` if the value is a `Map`; otherwise, `false`.
 *
 * @example
 * isMap(new Map()); // true
 * isMap({}); // false
 * isMap(null); // false
 * isMap(new Set()); // false
 */
function isMap(val) {
    return val instanceof Map;
}

/**
 * Checks if the provided value is an instance of `Set`.
 * If the value is a `Set`, it returns `true`; otherwise, it returns `false`.
 *
 * @function isSet
 * @param {*} val - The value to be checked.
 * @returns {boolean} `true` if the value is a `Set`; otherwise, `false`.
 *
 * @example
 * isSet(new Set()); // true
 * isSet([]); // false
 * isSet(new Map()); // false
 * isSet(null); // false
 */
function isSet(val) {
    return val instanceof Set;
}
/*
// Example usage:
console.log(isBool(true)); // true
console.log(isBool("true")); // false
console.log(isObj({})); // true
console.log(isObj([])); // false
console.log(isMap(new Map())); // true
console.log(isMap({})); // false
console.log(isSet(new Set())); // true
console.log(isSet(null)); // false
*/

/**
 * Returns a function that check if the all the elements contains element the match a contract. Where a contract is a test
 * function that returns true or false depending on if the contract is satisfied.
 * 
 * For example `let arrayOfStrings = arrayOf(isString)`
 *
 *  `let array1 = ["hello", "world"]` 
 *  `arrayOfStrings(array1)` will return true
 *
 *  `let array2 = ["hello", 1]`
 *  `arrayOfStrings(array2)` will return false
 *
 *  
 * @param  {[type]} contract [description]
 * @return {[type]}          [description]
 */
function arrayOf(contract=notNull) {
		return arr => Array.isArray(arr) && (arr.every(contract)? arr : undefined);
}


