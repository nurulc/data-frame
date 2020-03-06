
import isEmpty from '../../utils/types/isEmpty';
import {cmpStrNum} from '../../utils/sort-helper/cmpStrNum';

/**
 * [gbMax description]
 * @param  {[type]}   name    [description]
 * @param  {[type]}   newName [description]
 * @param  {Function} fn      [description]
 * @return {[type]}           [description]
 */
export default function gbMax(name,newName,fn) {
	if(fn === undefined && typeof newName === 'function') {
		fn = newName;
		newName = undefined;
	}
	newName = newName || name;
	fn = fn || maxOp;
	function max(action,accum,count, val) {
		if( accum === undefined ) accum = fn(val,'');
		return (isEmpty(val) || action !== 1)?[accum,count]:[fn(val,accum),count+1];	
	}
	return [max,name,[() => undefined,0],newName];
}
function maxOp(a,b) { return cmpStrNum(a,b)>0?a:b; }

