
import isArray from '../../utils/types/isArray';

/**
 * return the intersection of two arrays
 * @param  {Array} arr1 [description]
 * @param  {Array} arr2 [description]
 * @return {Array}      [description]
 */
export default  function arrIntersect(arr1, arr2) {
	var array = {};
	if (!isArray(arr1) || !isArray(arr2)) {
		throw new TypeError('Invalid argument, Please pass proper array argument');
	}

	var result = [];
	for (var i = 0; i < arr1.length; i++) {

		if (array[arr1[i]] === undefined)
			array[arr1[i]] = arr1[i];
	}

	for ( i = 0; i < arr2.length; i++) {
		if (array[arr2[i]] !== undefined) {

			result.push(arr2[i]);
			array[arr2[i]] = undefined;
		}
	}
	return result;
}


