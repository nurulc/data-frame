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
 * Code taken from https://github.com/darkskyapp/string-hash, 
 * Too small to be worth is own module.
 * @param  {string} str	The string to hash (isf str is not a string make it into a string)
 * @param  {int32} start	start pos in the string
 * @param  {int32} end	The end position of thestring
 * @return {int32}		The hash value
 */
export default function strHash(str,start,end) {
	if(str === undefined) return 5381;
	if(typeof str !== 'string') str = str.toString();
	var hashV = 5381|0,
		ln    = (end || str.length) | 0;
	var i = start || 0;
	if( ln - start > 7) ln = start+7;
	for(;i< ln;) {
		hashV = (hashV * 33) ^ str.charCodeAt(i++);
	}
	if( hashV === 0 ) hashV = 1;

	/* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
	 * integers. Since we want the results to be always positive, convert the
	 * signed int to an unsigned by doing an unsigned bitshift. */
	return hashV>>>0;
}


