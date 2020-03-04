

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






