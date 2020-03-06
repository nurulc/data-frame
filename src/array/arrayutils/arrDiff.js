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

// return the difference of two arrays same as arr1 xor arr2
/**
 * return the difference of two arrays same as arr1 xor arr2
 * @param  {Array} arr1 [description]
 * @param  {Array} arr2 [description]
 * @return {Array}      [description]
 */
export default  function arrDiff(arr1, arr2) {
	let array = {};
	if (!isArray(arr1) || !isArray(arr2)) {
		throw new TypeError('Invalid argument, Please pass proper array argument');
	}

	var result = [];
	for (let i = 0; i < arr2.length; i++) {
		array[arr2[i]] = arr2[i];
	}

	for (let i = 0; i < arr1.length; i++) {
		if (array[arr1[i]] === undefined)
			result.push(arr1[i]);
	}
	return result;
}

