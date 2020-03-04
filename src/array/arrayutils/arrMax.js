
import arrCurry from './arrCurry';

/**
 * [description]
 * @param  {Function} fn   [description]
 * @param  {[type]}   arr) {	var        min [description]
 * @return {[type]}        [description]
 */
export default  arrCurry(function(fn,arr) {
	var min = fn(arr[0]);
	for (var i = 0; i < arr.length; i++) {
		min = Math.max(min,fn(arr[i]));
	}
	return min;
});


