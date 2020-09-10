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
/**
 * gbCount  count elemnts (non empty) in a group, bases on sql group by operation  
 * e.g.   'select state, quater, count(sale_price) as items_sold from annual_sales groupby state, quater'
 *        in frame operation
 *        summary = frame.groupBy(['state', 'quater', gbCount('sale_price', 'items_sold')]);
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
export default function gbCount(name,newName) {
	newName = newName || name;
	function count(action,accum,count, val) {
		if( accum === undefined ) accum = 0;
		if( action !==1 ) return [count,count];
		return isEmpty(val)?[accum,count]:[accum+1,count+1];
	}
	return [count,name,[()=> 0, 0 ] ,newName];
}

