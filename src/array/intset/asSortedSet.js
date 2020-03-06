
import dedupSortedArr from './dedupSortedArr';
import hasNoDups from './hasNoDups';
import isSorted from './isSorted';

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

