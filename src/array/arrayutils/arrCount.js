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

import arrCurry from './arrCurry';

/**
 * [description]
 * @param  {[type]} testFn [description]
 * @param  {[type]} arr)   {		let       len [description]
 * @return {[type]}        [description]
 */
export default  arrCurry(
	function(testFn,arr) {
		let len = arr.length;
		let count = 0;
		for(let i=0; i<len; i++) {
			if(testFn(arr[i])) count++;
		}
		return count; //list.reduce((cnt,e) => (e || '').trim() == v ? cnt+1 : cnt, 0);
	});

