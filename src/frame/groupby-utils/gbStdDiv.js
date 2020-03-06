
import isEmpty from '../../utils/types/isEmpty';
import {toNumber} from '../../utils/sort-helper';
/**
 * [gbStdDiv description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
export default function gbStdDiv(name, newName) {
	newName = newName || name;
	function stdDiv(action,[accumSq,accum],count, val) {
		if( accum === undefined ) accum = [0,0];
		if( action === 1) {
			if(count>1) return [Math.sqrt((count*accumSq-accum*accum)/count*(count-1.0)),count];
			else if(count > 0) return[[undefined,accum/count], count];
			else return [[undefined,undefined],0];
		}
		let v = toNumber(val);
		return isEmpty(v) ?[[accumSq,accum],count]:[[accumSq+v*v,accum+v],count++];
	}
	return [stdDiv,name,[() => [0,0],0],newName];
}

