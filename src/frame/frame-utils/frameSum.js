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
import getColIx from '../getColIx';


/**
 * [frameSum description]
 * @param  {Frme} aFrame   the frme to operate on
 * @param  {string} colName  name of the column to sum
 * @param  {function} convName optional function to convert a name to a new name
 * @param  {function} convValue optional function to conver the value
 * @return {[type]}           [description]
 */
export default function frameSum(aFrame, colName, convName, convValue) {
	aFrame = haveFrame(aFrame);
	let name = aFrame.name;
	let ix = getColIx(aFrame,colName);
	let sum = aFrame.data.reduce((s,row) => s+row[ix],0);
	let nn = ( convName  ) ? convName(name) : name;
	let nv = ( convValue ) ? convValue(sum) : sum;
	return [nn, nv];
}

