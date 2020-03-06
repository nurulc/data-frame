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
 * array subtraction arr - listToRemove  (return an array with all elements
 * of arr this is not in listToRemove)
 * @param  {Array} arr
 * @param  {Array} listToRemove
 * @return {Array} new array that contains all values of (arr) that are not in listToRemove
 */
export default  function arrRemove(arr, listToRemove) {
	if(!listToRemove || listToRemove.length === 0) return arr || [];
	if(!arr || arr.length === 0) return [];
	return arr.filter( e => listToRemove.indexOf(e) === -1);
}


