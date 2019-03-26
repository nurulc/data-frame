// Use with a reducer
export const FLATTEN = (res=[],arr) => Array.isArray(arr)?res.concat(arr):(res.push(arr), res);

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



