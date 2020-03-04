
import isArray from './isArray';
/**
 * Get the last element of an array
 * 
 * @param  {[type]} arr      [description]
 * @param  {String} defaultV [description]
 * @return {[type]}          [description]
 */
export default function last(arr,defaultV='') {
	if(!isArray(arr))  return undefined;
	if( !arr || arr.length === 0) return defaultV;
	return arr[arr.length-1];
}

