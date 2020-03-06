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
import localGroupBy from './localGroupBy';
/**
 * Creates a index for a column (dictionary)
 * @param  {Frame}   aFrame  Fram to index
 * @param  {String}  colName name of the column to index
 * @param  {boolean} noNull  Optional (false) if false, null is added to the dictionary
 * @param  {Object}  dict    Optional
 * @return {Dict}            Dict[key] --> array of columns that contain the key in column(colName). Note a row is an array of columns
 */
export default  (aFrame,colName,noNull=false,dict={}) => {
	aFrame = haveFrame(aFrame);
 
	let ix = aFrame.colIx(colName);
	return localGroupBy(aFrame.data,ix,noNull,dict);
};


