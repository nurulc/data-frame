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
 * return the union of two arrays
 * @param  {Array} arr1 [description]
 * @param  {Array} arr2 [description]
 * @return {Array}      [description]
 */
export default  function arrUnion(arr1, arr2) {

	if(!arr1|| arr1.length === 0) return arr2 || [];
	if(!arr2|| arr2.length === 0) return arr1 || [];

	var aSet = new Map();
	if (!isArray(arr1) || !isArray(arr2)) {
		throw new TypeError('Invalid argument, Please pass proper array argument');
	}

	let result = [];
	for (let i = 0; i < arr1.length; i++) {

		if (aSet.get(arr1[i]) === undefined) {
			aSet.set(arr1[i],arr1[i]);
			result.push(arr1[i]);
		}
	}

	for (let i = 0; i < arr2.length; i++) {

		if (aSet.get(arr2[i]) === undefined) {
			result.push(arr2[i]);
			aSet.set(arr2[i], arr2[i]);
		}
	}
	return result;
}

