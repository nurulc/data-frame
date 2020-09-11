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

//
import haveFrame from '../haveFrame';
/**
 * [frameWithIndex description]
 * @param  {Frame} aFrame The frame to add the index to
 * @return {Frame}        new frame with an index column (remove and previous index column)
 */
export default function frameWithIndex(aFrame, indexName='_INDEX', atEnd) {
	if( ! aFrame ) return new aFrame.constructor([],[]);
	aFrame = haveFrame(aFrame);
	let cols;
	if(atEnd) 	cols = [...aFrame.columns.filter(n => n !== indexName),indexName]
	else 		cols = ['_INDEX', ...aFrame.columns.filter(n => n !== indexName)]
	return aFrame.project(cols, {[indexName]: (_,ro) => ro.__index$ });
}

