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
 * checks if sorted array has no dups, pure function - does not modify the input
 * @param  {[Array]}  arr - sorted set of values
 * @return {[Boolean]}     - true if the sorted array has no diplicated, false otherwise (undefined is not a sorted set)
 */
export default function hasNoDups(arr /*sorted*/) {
	if( !arr ) return false
	let len=arr.length-1;
	for(let i=0;i<len;i++){
		if(arr[i] > arr[i+1]) throw new Error("arr (param) is not sorted");
		if(arr[i]===arr[i+1]) {
			return  undefined;
		}
	}
	return arr;
}

