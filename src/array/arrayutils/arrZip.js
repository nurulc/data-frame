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

import newArray from './newArray';

/**
 * zip and array, given an array of columns (each element is a column of values) converts and array of column arrays to and array row arrays
 * @param  {Aarry} arrays array of column arrays
 * @return {Array}           array of row arrays - [ [arrays[0][0],arrays[1][0], arrays[2][0], ... ], [arrays[0][1],arrays[1][1], arrays[2][1], ... ]
 */
export default  function arrZip(...arrays) {
	let mx = arrMax(a=>a.length,arrays);
	const cnt = arrays.length;
	let res = newArray(mx,null);
	for(let i=0; i<mx; i++) {
		let el = [];
		for(let j=0; j<cnt; j++){
			el.push(arrays[j][i]);
		}
		res[i] = el;
	}
	return res;
}

