
import arrEQ from '../arrEQ';
/**
 * arrDistinct description, not array equal
 * @param  {[type]} arr1 [description]
 * @param  {[type]} arr2 [description]
 * @return {[type]}      [description]
 */
export function arrDistinct(arr1, arr2) {
	return (!arrEQ(arr1, arr2));
}


