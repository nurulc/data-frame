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

import EMPTY_KEY from './EMPTY_KEY';
export default function localGroupBy(data,ix,noNull=false,dict={}) {
	data.forEach(r => addDict(dict, r[ix],r,noNull));
	return dict;
}


function addDict(dict, key, val,noEmpty) {
	if( noEmpty && !key) return dict;
	key = key || EMPTY_KEY;
	let list = dict[key];
	if( !list ) {
		dict[key] = [val];
	} else {
		if(val !== undefined)
			list.push(val);
	}
	return dict;
}

