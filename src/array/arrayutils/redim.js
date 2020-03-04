
import newArray from './newArray';

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
export default  function redim(arr, n) {
	let result = [];
	let len = arr.length;
	let len_n = len+n-1;
	let _v = arr[0];
	for (var i = 0; i < len_n; i += n) {
		if(len-i <= 0) break;
		var r = newArray(Math.min(n, len-i), _v);
		var j=0;
		for(; j<n && i+j<len; j++) {
			r[j] = arr[i+j];
		}
		r.length = j;
		result.push(r);
	}
	return result;
}
