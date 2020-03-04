
import arrCurry from './arrCurry';

/**
 * [description]
 * @param  {[type]} testFn [description]
 * @param  {[type]} arr)   {		let       len [description]
 * @return {[type]}        [description]
 */
export default  arrCurry(
	function(testFn,arr) {
		let len = arr.length;
		let count = 0;
		for(let i=0; i<len; i++) {
			if(testFn(arr[i])) count++;
		}
		return count; //list.reduce((cnt,e) => (e || '').trim() == v ? cnt+1 : cnt, 0);
	});

