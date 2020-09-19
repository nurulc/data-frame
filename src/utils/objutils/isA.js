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
 * [isArray description]
 * @param  {[any]}  arr Javascript arry of any type
 * @return {Boolean}     true of the item is an array
 */
function isArray(arr) {
		if( !arr) return undefined;
		if(Array.isArray(arr)) return arr;
		return (arr.constructor === Array)?arr:undefined;
}

function notNull(obj) { return (obj !== null && obj !== undefined)?obj: undefined; }
function isFunc(fun) {return (typeof fun === 'function')?fun:undefined; }
function isStr(str) {return (typeof str === 'string')?str:undefined; }
function isNum(num) {return (typeof num === 'number')?num:undefined; }
function isBool(val) {return (typeof val === 'boolean')?val:undefined; }
function isObj(_obj) {return (!Array.isArray(_obj) && typeof _obj === 'object')?_obj:undefined; }
function isMap(aMap) {return (aMap instanceof Map)?aMap:undefined; }
function isSet(aSet) {return (aSet instanceof Set)?aSet:undefined; }

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


