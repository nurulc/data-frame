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

/**
 * Takes a array of string lines, representing a list of 'row' strings. and for 
 * each row is split into column elements (each a string) using a splitter function.
 * @param  {[string]}   data     array of string lines
 * @param  {function}   splitter function to split a string representing a row into an array of strings representing column elements
 * @param  {function} fn       optional function to apply to string line fn(line,line_number) before applying the splitter
 * @return {[string]}          this is the same as buffer.map(fn|Idnetity).map(splitter)
 */
export default function dataSplit(data,splitter,fn) {
	let len = data.length;
	let res = [];
	res.length = len;
	if( splitter === undefined) splitter = psvLine;
	if( fn === undefined) {
		for(let i=0; i<len; i++) {
			res[i] = splitter(data[i]);
		}
	}
	else {
		for(let i=0; i<len; i++) {
			res[i] = splitter(fn(data[i],i));
		}
	}
	return res;
}



