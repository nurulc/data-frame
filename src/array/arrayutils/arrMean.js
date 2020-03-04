
import arrCurry from './arrCurry';

/**
 * [description]
 * @param  {Function} fn   [description]
 * @param  {[type]}   arr) {	let        cnt [description]
 * @return {[type]}        [description]
 */
export default  arrCurry(function(fn,arr) {
	let cnt = 0, result = 0.0, len = arr.length;
	for (let i = 0; i < len; i++) {
		let v = fn(arr[i]);
		if( typeof v === 'number') {
			result += v;
			cnt++;
		}
	}
	return result*1.0/cnt;
});




