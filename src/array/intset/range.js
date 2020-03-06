
import newArray from '../arrayutils/newArray';
/**
 * Creates a set (array) of numbers [start ... (end-1)]
 * @param  {[int32]} start start value
 * @param  {[int32]} end   one mare then the last value in the result array
 * @return {[Array]}         [description]
 */
export default  function range(start, end) {
	if( end === undefined) { end = start; start = 0;}
	let res = newArray(end-start);
	start = start | 0;
	for(let i=start; i<end; i++) res[i-start] = i;
	return res;
}


