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

import {flatten} from '../../array/flatten';
/**
 * [toKeyValueListV description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export default function toKeyValueListV(obj) {
	let expand = Object.keys(obj).map(doExpand);
	return flatten(expand,1);
	function doExpand(k) {
		let v = obj[k];
		assert(Array.isArray(v), 'value must be an array')
		if( v.length == 1) {
			let res = [k, v[0]];
			return [res];
		}
		return v.map( e => [k, e]);
	}
}

