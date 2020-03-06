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

// Bunch of str 

// String reverse, looks to be the 
// import {getLie,getCol}   from '../bundle/claimutils';

/**
 * join an array of strings ignoring empty values
 * @param  {[String]} arrOfStrings array of strings
 * @param  {String} sep          seperator string
 * @return {String}              return a string of values seperated by 'sep' string
 */
export default  function strJoin(arrOfStrings, sep='') {
	if(arrOfStrings === undefined || arrOfStrings.length === 0) return '';
	if(typeof arrOfStrings === 'string') return arrOfStrings;
	if( !Array.isArray(arrOfStrings)) throw new Error('Array of strings expected: recieved '+arrOfStrings);
	let s = '';
	let sp = '';
	for(let i=0; i< arrOfStrings.length; i++) {
		let ss = arrOfStrings[i];
		if(!ss) continue;
		s += sp; s += ss;
		sp = sep;
	}
	return s;
}

