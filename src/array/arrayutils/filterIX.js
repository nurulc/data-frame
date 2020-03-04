
import newArray from './newArray';

/**
 * filter an attar and return the index found
 * @param  {Function} fn  	testing function for the filter
 * @param  {[any]}   arr 	array of items to filter
 * @return {[integre]}      return an array of indexex
 */
export function filterIX(fn,arr) {
	let ln = arr.length;
	let res = newArray(ln,0);
	let j = 0;
	for (let i = 0; i < ln; i++) {
		if (fn(arr[i])) res[j++] = i;
	}
	res.length = j;
	return res;	
}


