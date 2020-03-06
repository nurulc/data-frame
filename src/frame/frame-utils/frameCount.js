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

import {Frame} from '../frame';
import haveFrame from '../haveFrame';
import {range} from '../../array';
import getColIx from '../getColIx';
import {dataSplit} from '../../string/csv';

/**
 * [frameCount description]
 * @param  {Frme} aFrame   [description]
 * @param  {string} colName  [description]
 * @param  {function} convName function to convert a name to a new name
 * @return {[name, count]}     a two element array with the name and count
 */
export default function frameCount(aFrame, colName, convName) {
	aFrame = haveFrame(aFrame);
	let name = aFrame.name;
	let ix = getColIx(aFrame,colName);
	
	let sum = aFrame.data.reduce((s,row) => s+(row[ix]?1:0),0);
	if( convName ) return [convName(name), sum];
	return [name, sum];
}
