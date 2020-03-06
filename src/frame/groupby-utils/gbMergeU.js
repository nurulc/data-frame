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
import {arrDedup } from '../../array';
import accStr from './accStr';
/**
 * [gbMergeU description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @param  {[type]} sep     [description]
 * @return {[type]}         [description]
 */
export default function gbMergeU(name,newName,sep) {
	newName = newName || name;
	sep = sep || ', ';
	function merge(action,accum,count, val) {
		if( accum === undefined ) accum = [];
		if( action !== 1) {
			accum = accum.sort();
			accum = arrDedup(accum);
			return [(accum.length===1?accum[0]:accum.join(sep)), count];
		}
		return isEmpty(val) ?[accum,count]:[accStr(accum,val),count+1];
	}
	return [merge,name,[() => [],0],newName];
}
//we should later add gbMode (most occuring value), gbMedian (middle value)
