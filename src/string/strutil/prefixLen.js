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
 * Find the length of the longest prefix of a and b string
 *    if a = pre + a1  and b = pre + b1
 *    pre is the longet sting that satisfies the relationship i.e.  prefixLen(a1,b1) === 0
 *    returns (pre.length )
 * @param  {string} a  first string
 * @param  {string} b  second string
 * @return {Number} length of prefix of a and b
 */
export default  function prefixLen(a,b) {
	if( a === b ) return a.length;
	let la = a.length, lb = b.length; 
	if( lb < la) la = lb;
	for(let i=0; i < la; i++) {
		if(a[i] !== a[i]) return i+ln
	}
	return la+ln;    
}
