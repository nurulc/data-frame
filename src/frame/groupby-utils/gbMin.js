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

import isEmpty from '../../utils/types/isEmpty';
import {cmpStrNum} from '../../utils/sort-helper/cmpStrNum';
/**
 * [gbMin description]
 * @param  {[type]}   name    [description]
 * @param  {[type]}   newName [description]
 * @param  {Function} fn      [description]
 * @return {[type]}           [description]
 */
export default function gbMin(name,newName,fn) {
	if(fn === undefined && typeof newName === 'function') {
		fn = newName;
		newName = undefined;
	}
	newName = newName || name;
	fn = fn || minOp;
	function min(action,accum,count, val) {
		if( accum === undefined ) accum = fn(val,'');
		return (isEmpty(val) || action !== 1)?[accum,count]:[fn(val,accum)<0?val:accum,count+1];
	}
	return [min,name,[() => undefined,0],newName];
}

function minOp(a,b) { return cmpStrNum(a,b)<0?a:b; }



