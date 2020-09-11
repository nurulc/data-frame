import isArray from '../utils/types/isArray';
/**
 * Use with a reducer
 * @param  {Array}  res
 * @param  {[type]} arr
 * @return {[type]}
 */
export function FLATTEN(res=[],arr) { return  isArray(arr)?res.concat(arr):(res.push(arr), res); }

/**
 * Flatten an array to a depth of level, for example if level = 1, only flatten at the top level (depath1)
 * @param  {[with_inner_arra]} arr
 * @param  {integer} level - depth the given or undefined the flatten to the bottom
 * @return {[type]}
 */
export function flatten(arr, level) {
	if (!isArray(arr)) {
		throw new TypeError('Invalid argument, Please pass proper array argument');
	}
	var result = [];
	if (level === undefined)
		return recursiveFlatten(arr, result);
	else
		return recursiveFlattenWithDepth(arr, result, level);
}

function recursiveFlatten(arr, result) {
	for (var i = 0; i < arr.length; i++) {
		if (isArray(arr[i])) {
			recursiveFlatten(arr[i], result);
		} else
			result.push(arr[i]);
	}
	return result;
}



function recursiveFlattenWithDepth(arr, result, level) {

	for (var i = 0; i < arr.length; i++) {
		if (isArray(arr[i]) && level > 0) {
			recursiveFlattenWithDepth(arr[i], result, level-1);
		} else result.push(arr[i]);
	}
	return result;
}



