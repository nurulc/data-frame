
import isEmpty from '../../utils/types/isEmpty';
import {toNumber} from '../../utils/sort-helper';
/**
 * [gbMean description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
export default function gbMean(name,newName) {
	newName = newName || name;
	function mean(action,accum,count, val) {
		if( accum === undefined ) accum = 0;
		if( action !== 1) return [(count>0?accum/count:undefined), count];
		let v = toNumber(val);
		return isEmpty(v) ?[accum,count]:[accum+v,count+1];
	}
	return [mean,name,[() => 0,0],newName];
}
