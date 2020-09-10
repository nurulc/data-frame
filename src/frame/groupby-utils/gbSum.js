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

import {toNumber} from '../../utils/sort-helper';
/**
 * gbSum  sum eelemnts in a group, bases on sql group by operation  
 * e.g.   'select state, quater, sum(sale_price) as sales from annual_sales groupby state, quater'
 *        in frame operation
 *        summary = frame.groupBy(['state', 'quater', gbSum('sale_price', 'sales')]);
 *        
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
export default function gbSum(name,newName) {
	newName = newName || name;
	function sum(action,accum,count, val) {
		if( accum === undefined ) accum = 0;
				
		if( action !==1 ) return  [accum,count];
		else {
			let v = toNumber(val);
			return  v===undefined || isNaN(v) ?[accum,count]:[accum+v,count+1];
		}
	}
	return [sum,name,[()=>0,0],newName];
}

