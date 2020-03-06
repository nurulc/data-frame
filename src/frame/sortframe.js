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
import haveFrame from './haveFrame';
import { arrEQ } from '../array';
import {combineCmp, cmpNumOrStrBy,  revCmp} from '../utils/sort-helper';
import genColIxFunc from './genColIxFunc';


/**
 * create a comparison function for a frame
 * usage sortFrameBy(['+surname', 'givenName', '-age'], aFrame)
 * + == ascending
 * - == descending 
 * @param  {[type]} columnNames [description]
 * @param  {[type]} aFrame      [description]
 * @param  {[type]} cmpFn       [description]
 * @return {[type]}             [description]
 */
export default function sortFrameBy(columnNames,aFrame,cmpFn=cmpNumOrStrBy) {
	aFrame = haveFrame(aFrame);
	// function to get the index of the column given a name
	
	if(!columnNames || !columnNames.length || arrEQ((aFrame.sorted||[]), columnNames)) return aFrame;
	let colIx = genColIxFunc(aFrame);
	//create a comparison function give an column name
	// -name (sort acending) +name or name, to sort descending	                
	let cmps = (name) => name[0]==='-'?revCmp(cmpFn(colIx(name.substr(1))))
		: (name[0] === '+'?cmpFn(colIx(name.substr(1))):
			cmpFn(colIx(name)));
	let data = aFrame.data.slice(0);
	data.sort(combineCmp(...columnNames.map(cmps)));
	let resFrame = new aFrame.constructor(data,aFrame.columns, aFrame.name, aFrame.keyFunc);
	resFrame.sorted = columnNames;
	return resFrame;
}