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

import haveFrame from '../haveFrame';
import {range} from '../../array';

/**
 * [transpose description]
 * @param  {[type]} frame [description]
 * @param  {[type]} pivot [description]
 * @return {[type]}       [description]
 */
export default function transpose(frame, pivot) {
	let actualPivot = pivot;
	frame = haveFrame(frame);
	let len = frame.length;
	let columns = frame.columns;
	if(pivot === undefined) {
		if(columns.indexOf('__ROW') !== -1) {
			pivot = '__ROW';
			actualPivot = undefined;
			//console.log("HERE")
		}
		else {
			pivot = frame.keyName();
			if(typeof pivot === 'function') pivot = undefined;
			actualPivot = pivot;
			//console.log("THERE")

		}
	}
	let data;
	if(pivot === '__ROW')
		data = columns.filter(c => c !== pivot).map((c) => frame.rawColumn(c));
	else
		data = columns.filter(c => c !== pivot).map((c) => [c, ...frame.rawColumn(c)]);
	let newColumns = (columns.indexOf(pivot) !== -1? frame.rawColumn(pivot):range(len)).map(v => ''+v);
	//if(pivot && newColumns.indexOf(pivot) !== -1) pivot = undefined;
	if(pivot !== '__ROW')
		newColumns = [(pivot?pivot:'__ROW'), ...newColumns];
	//console.log({pivot,actualPivot, newColumns, index: columns.indexOf('__ROW')});
	return new frame.constructor(data, newColumns, 'transpose-'+(frame.name||'frame'), actualPivot);
}

