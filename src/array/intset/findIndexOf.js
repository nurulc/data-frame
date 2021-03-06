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
 * find the index of an element is a sorted array representing a set, uses binary search
 * @param  {[Array]} aSet          Sorted array representing a set
 * @param  {[Any]} searchElement he item to search for within the array
 * @return {[Int]}               The index of the element which defaults to -1 when not found.
 */
export default function findIndexOf(aSet, searchElement) { 
	let minIndex = 0;
	let maxIndex = aSet.length - 1;
	let currentIndex;
	let currentElement;
 	


	while (minIndex <= maxIndex) {

		currentIndex = (minIndex + maxIndex) >>> 1;
		currentElement = aSet[currentIndex];
 
		if (currentElement < searchElement) {
			minIndex = currentIndex + 1;
		}
		else if (currentElement > searchElement) {
			maxIndex = currentIndex - 1;
		}
		else {
			return currentIndex;
		}
	}
 
	return -1;
}






