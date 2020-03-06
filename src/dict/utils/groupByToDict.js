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

import getColIx from '../../frame/getColIx';
import {MultiDict} from './MultiDict'
import haveFrame from '../../frame/haveFrame';
import {Frame} from '../../frame';

/**
 * Returns an array of Frames, for each group
 * the name of the Frameis the value of the grouping
 * @param  {[type]} aFrame  [description]
 * @param  {[type]} colName [description]
 * @param  {[type]} cmp     [description]
 * @param  {[type]} mapFn   [description]
 * @return {[type]}         [description]
 */
export default function groupByToDict(aFrame, colName, cmp,mapFn) {
	aFrame = haveFrame(aFrame);
	let ix = getColIx(aFrame, colName);
	mapFn = mapFn || identity;
	let dict = new MultiDict();
	
	aFrame.data.forEach(row => dict.set(mapFn(row[ix]), row));
	let arr = Object.keys(dict.dict).map(key => new Frame( dict.dict[key], aFrame.columns, ''+key));

	cmp = cmp || cmpStrNum;
	arr.sort((frame1, frame2) => cmp(frame1.name, frame2.name));
	return arr;
}

