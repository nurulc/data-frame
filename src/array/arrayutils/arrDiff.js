
import isArray from './isArray';

// return the difference of two arrays same as arr1 xor arr2
/**
 * return the difference of two arrays same as arr1 xor arr2
 * @param  {Array} arr1 [description]
 * @param  {Array} arr2 [description]
 * @return {Array}      [description]
 */
export default  function arrDiff(arr1, arr2) {
	let array = {};
	if (!isArray(arr1) || !isArray(arr2)) {
		throw new TypeError('Invalid argument, Please pass proper array argument');
	}

	var result = [];
	for (let i = 0; i < arr2.length; i++) {
		array[arr2[i]] = arr2[i];
	}

	for (let i = 0; i < arr1.length; i++) {
		if (array[arr1[i]] === undefined)
			result.push(arr1[i]);
	}
	return result;
}

