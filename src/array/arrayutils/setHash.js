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
 * function to take the hash of an array of integers
 * @param {[int]} arrOfInt array of integers
 * @return {[type]}      [description]
 */
export function setHash(arrOfInt) {
	var hash = 5381,
		i    = arrOfInt.length ;
	if( i > 5 ) i=5;
	let j=i;
	while(i--) {
		hash = (hash * 33) ^ arrOfInt[j-i];
	}

	/* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
	 * integers. Since we want the results to be always positive, convert the
	 * signed int to an unsigned by doing an unsigned bitshift. */
	return hash >>> 0;    
}

