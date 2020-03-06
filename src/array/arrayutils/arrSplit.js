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
 * split an array into n more or less equal length arrays
 * @param  {int} n
 * @param  {Array} arr
 * @return {Array} - return an array of arrays where each inner array is approximately of length n or less
 */
export default  function arrSplit(n,arr) {
	if( n<= 0) throw new Error('array cannot be split to chunks < 0 : \''+n+'\'');
	if(arguments.length === 1) return (arr) => arrSplit(n,arr); // return a function
	let len = arr.length;
	if(n >= len) return [arr];
	let res = [],i;
	for(i=n; i<len; i+= n) {
		res.push(arr.slice(i-n,i));
	}
	res.push(arr.slice(i-n));
	return res;
}

