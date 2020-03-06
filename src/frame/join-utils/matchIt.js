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
/*local*/ 
/**
 * leftJoin on one row from left and arr from right
 * @param  {[type]} res
 * @param  {[type]} row1
 * @param  {[type]} arr
 * @param  {[type]} cmp
 * @param  {[type]} tr
 * @return {[[row-element]} 
 */
export default function matchIt(res,row1,arr, cmp, tr) {
	let len,  cnt =0;
	if( !arr || arr.length === 0 ) len = 0;
	else len = arr.length;
	let transform = tr[0];
	
	for(let i=0; i< len; i++) {
		let row2 = arr[i];
		if(cmp(row1,row2)) {
			res.push(transform(row1,row2));
			cnt++;
		}
	}
	if( cnt === 0 ) {
		transform = tr[1];
		res.push(transform(row1,[]));
	}
	return res;
}

