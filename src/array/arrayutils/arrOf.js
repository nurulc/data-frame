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
 * create an array of same values (aVal) where the result has n of those values
 * @param  {any} aVal  - a value to duplicate n times
 * @param  {int32} n    number of occurences in the array
 * @return {Array}      - Array of length (n) all filled aValue
 */
export default function arrOf(aVal,n) {
	let v = [];
	// TODO: hndle if val is a function
	if(typeof aVal === 'function')
		for(var i=0; i<n; i++) v.push(aVal(i));
	else for(var i=0; i<n; i++) v.push(aVal);
	return v;
}

