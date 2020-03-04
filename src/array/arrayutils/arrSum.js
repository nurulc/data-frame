
import arrCurry from './arrCurry';

/**
 * Add all elements of an array, optionall apply a transform function fn to each element
 * @param  {Function} fn   [description]
 * @param  {[type]}   arr) {	if         (arr.length [description]
 * @return {[type]}        [description]
 */
export default  arrCurry(function(fn,arr) {
	if (arr.length === 0)
		return 0;
	var result = fn(arr[0]);
	for (var i = 1; i < arr.length; i++)
		result += fn(arr[i]);
	return result;
});

