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
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
export default  function xor(array1, array2) {
	let ixa =  arrIntersect(array1,array2);
	//console.log(ixa)
	let set = new Set(ixa);
	let len = ixa.length; ixa = undefined;
	let res = newArray(array1.length + array2.length - 2*len,null);
	//console.log("len",res.length)
	let j=0;
	len = array1.length;
	for(let i=0; i<len; i++ ) {
		let v = array1[i];
		if( !set.has(v) ) res[j++] = v;
	}
	len = array2.length;
	for(let i=0; i<len; i++ ) {
		let v = array2[i];
		if( !set.has(v) ) res[j++] = v;
	}
	//console.log("len 1", j)
	res.length = j;

	return res;
}

