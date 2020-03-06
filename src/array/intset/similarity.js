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
 * Show how similar two sets (sorted list) actually are
 * @param  {[Array]} sortedA [description]
 * @param  {[Array]} sortedB [description]
 * @return {[Array]}         where the array contains[same_count, different_count]
 */
export default  function similarity(sortedA, sortedB) {
	let j=0;
	let lenA = sortedA.length;
	let lenB = sortedB.length;
	let same = 0;
	for(let i =0; i< lenA && j< lenB;i++) {
		let iA = sortedA[i];
		if(iA == sortedB[j]) {
			same++;
			j++;
		} else {
			while(j<lenB && iA > sortedB[j]) j++;
					
			if( j == lenB) break;
			if(iA == sortedB[j]) {
				same++
				j++;
			}
		}
	}
	return [same, lenA+lenB-2*same];   
}

