

import arrCurry from './arrCurry';
/**
 * [description]
 * @param  {Function} fn   [description]
 * @param  {Array}      arr) {	var        dict [description]
 * @return {Array}        [description]
 */
export default  arrCurry(function(fn,arr) {
	var dict = new Map();
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		let e = arr[i];
		let v = fn(e);
		if (dict.get(v) === undefined) {
			dict.set(v, e);
			result.push(e);
		}
	}
	return result;
});

