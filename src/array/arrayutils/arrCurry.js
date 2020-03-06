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
 * THis decorates and array function so that it can have one of two forms
 * 1. arrayFunction(mappingFunction, array)
 * 2. arrayFunction(array)
 * 3. arrayFunction(mappingFunction) - return a new function that takes just an arra
 *
 * the originam
 * performs checks and currying for the functions below    
 * acts on a function of the form arrFunc(transFormFunction, arr)
 * @param  {Function} functionToDecorate [description]
 * @return {Function}        [description]
 */
export default function arrCurry(functionToDecorate) {
	return function (transformElement,arr) {
		if( isFunction(transformElement) ) {
			if( arr === undefined ) return (array) => functionToDecorate(transformElement, array);
			else if(isArray(arr)) return functionToDecorate(transformElement,arr);		
		}
		if( isArray(transformElement) ) {
			if( arr === undefined) {
				arr = transformElement;
				return functionToDecorate(ID,arr);
			}
		}
		throw new TypeError('Invalid argument, Please pass proper array argument');
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

