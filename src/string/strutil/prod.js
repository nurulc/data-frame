
import {flatten} from '../../array/flatten';
/**
 * This is rthe cross product of two arrays, where each arrys is an array of strings
 * the result is and array of length m x n, where m is the length of the first vector
 * and n is the length of the second vector
 *
 * this is like a full multiplication table where the inner operation (the multiplication) is
 * string concatination. Note if either array is a scalar string it is converted into an array
 * 
 * tring prod out, example prod(['a','b'], ['x1', 'x2']) => [ 'ax1', 'bx1', 'ax2', 'bx2' ]
 * 
 * @param  {string|[string]} s    a string or array of strings
 * @param  {[string]} list of strings
 * @return {[string]}      [description]
 */
export default  function prod(s,list) { 
	if(!Array.isArray(list)) list = list?[list]:[];
	if(Array.isArray(s)) {
		return flatten(s.map(x => prod(x,list)));
	}
	else {
		if(!s) return list.slice();
		if(list.length == 0) return [s];
		else return list.map( x => s+x);
	} 
}
