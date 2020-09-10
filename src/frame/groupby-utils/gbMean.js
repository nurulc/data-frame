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
import {toNumber} from '../../utils/sort-helper';
/**
 * gbMean average (mean) value of a group - see gbMin
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
export default function gbMean(name,newName, fn=isEmpty) {
	newName = newName || name;
	function mean(action,accum,count, val) {
		if( accum === undefined ) accum = 0;
		if( action !== 1) return [(count>0?accum/count:undefined), count];
		let v = toNumber(val);
		return isEmpty(v) ?[accum,count]:[accum+v,count+1];
	}
	return [mean,name,[() => 0,0],newName];
}
