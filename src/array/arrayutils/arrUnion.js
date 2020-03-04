
import isArray from './isArray';

/**
 * return the union of two arrays
 * @param  {Array} arr1 [description]
 * @param  {Array} arr2 [description]
 * @return {Array}      [description]
 */
export default  function arrUnion(arr1, arr2) {

	if(!arr1|| arr1.length === 0) return arr2 || [];
	if(!arr2|| arr2.length === 0) return arr1 || [];

	var aSet = new Map();
	if (!isArray(arr1) || !isArray(arr2)) {
		throw new TypeError('Invalid argument, Please pass proper array argument');
	}

	let result = [];
	for (let i = 0; i < arr1.length; i++) {

		if (aSet.get(arr1[i]) === undefined) {
			aSet.set(arr1[i],arr1[i]);
			result.push(arr1[i]);
		}
	}

	for (let i = 0; i < arr2.length; i++) {

		if (aSet.get(arr2[i]) === undefined) {
			result.push(arr2[i]);
			aSet.set(arr2[i], arr2[i]);
		}
	}
	return result;
}

