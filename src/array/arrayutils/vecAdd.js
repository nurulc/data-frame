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
 * Add two vectors
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
export default  function vecAdd(a1,a2) {
	if(a1 === undefined ){
		if(Array.isArray(a2)) return a2.slice();
		else return undefined;
	} else  if(a2 === undefined ){
		if(Array.isArray(a1)) return a1.slice();
		else return undefined;
	} else if(a1.length < a2.length) {
		return a2.map((v,i) => v+(a1[i]||0));
	} else return a1.map((v,i) => v+(a2[i]||0));
}

