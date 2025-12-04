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
 * count the number of occurences of char in the string and 
 * optionally return the index of the char in the string
 * @param  {string} data  source string 
 * @param  {char} char  character to count
 * @param  {[int32]} arr   optional array to place the index of char in string
 * @param  {int32} start optional start start index of the string
 * @param  {int32} end   optional last index of the string
 * @return {int32}       number of occurences of the char in the string
 */
export default  function countCh(data, char, arr, start, end) {
	if( data === undefined || data === null) return 0;
	let i = Math.min(end || data.length, data.length);
	start = start || 0;
	let ch = char.charCodeAt(0)|0;   
	let ix = 1;
	if( arr !== undefined || arr !== null) {
		let end = i;
		i = start;

		while(i < end) 
			if(data.charCodeAt(i++) === ch) {
				if( ix < arr.length)
				 arr[ix++] = i-1;
				else ix++;
			}
	}
	else {
		while(i > start) 
			if(data.charCodeAt(--i) === ch) ix++;
	}
	return ix-1;
}