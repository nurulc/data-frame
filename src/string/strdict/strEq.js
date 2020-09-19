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
 * strEq str.substring(strStart,strEnd) === otherStr
 * @param  {string} str      str take str.substring(strStart,strEnd)
 * @param  {int32} strStart start index for `str`
 * @param  {int32} strEnd   end index for `str`
 * @param  {string} otherStr other string in the compare
 * @return {boolean}          true =equal, false = not equal
 */
export default function strEq(str, strStart, strEnd, otherStr) {
	if( strEnd - strStart !== otherStr.length) return false;
	for(let i=strStart, j=0; i<strEnd; i++, j++) if( str[i] !== otherStr[j]) return false;
	return true;
}


