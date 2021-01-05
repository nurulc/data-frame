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
 * gbStdDiv standard deviation - see gbMin
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
export default function gbSampleStdDiv(name, newName) {
	newName = newName || name;
	function stdDiv(action,[accumSq,accum],count, val) {
		if( accum === undefined ) accum = [0,0];
		if( action === 1) {
			if(count>1) return [Math.sqrt((count*accumSq-accum*accum)/count*(count-1.0)),count];
			else return ['',0];
		}
		let v = toNumber(val);
		return isEmpty(v) ?[[accumSq,accum],count]:[[accumSq+v*v,accum+v],count++];
	}
	return [stdDiv,name,[() => [0,0],0],newName];
}

