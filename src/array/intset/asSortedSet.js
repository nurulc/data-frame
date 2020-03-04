
//intset.js
// assumes and array with elements that are a sorted set of values (no duplicates) - works best with intgers
// exports: 
//     dedupSortedArr, 
//     hasNoDups, 
//     asSortedSet, intersect, intersectL, max, union, unionL, subtract,findIndexOf


 //   - all the arrays must be sorted for this to work

// asSortedSet(array) - converted an unsorted array to a sorted array

// 	dedupSortedArr(arr) - remove duplicates
	// hasNoDups(arr)
	// similarity(sortedA, sortedB) - [same_count, different_count], how similar are the sets
	// intersect( sorted1, sorted2, ...) - intersection of a list of sets
	// intersectL(listOfsortedArrays)
	// union(...list) - union of a list of sorted 
	// subtract(fromSet,elementsToRemove) - set subtraction
	// max(sortedList)  - max of a sorted list

	// range(start, n)

/**
 * converts an array to sorted set, pure function - does not modify the input
 * @param  {[string|number]} array  - the array to sorted and dedup
 * @return {[string|number]}          return a deduped sorted array
 */
export default function asSortedSet(array) {
	let arr;
	if( isSorted(array)) arr = array;
	else arr = array.slice(0).sort( (a,b) => a<b?-1:a===b?0:1);
	return  hasNoDups(arr) || dedupSortedArr(arr);
}

