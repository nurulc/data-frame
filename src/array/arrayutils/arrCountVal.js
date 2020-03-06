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
 * is str a string
 * @param  {String} str
 * @return {boolean} - true if str is a string
 */
function isString(str) {
	return (typeof str === 'string')?str:null;
}
/**
 * [arrCountVal description]
 * @param  {[type]} list [description]
 * @param  {[type]} v    [description]
 * @return {[type]}      [description]
 */
export function arrCountVal(list,v) {
	v = isString(v) ? (v?v.trim():''):v;
	let len = list.length;
	let count = 0;
	for(let i=0; i<len; i++) {
		if(list[i] === v) count++;
	}
	return count; //list.reduce((cnt,e) => (e || '').trim() == v ? cnt+1 : cnt, 0);
}


