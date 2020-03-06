
import isEmpty from '../../utils/types/isEmpty';
import {cmpStrNum} from '../../utils/sort-helper/cmpStrNum';
/**
 * [gbMin description]
 * @param  {[type]}   name    [description]
 * @param  {[type]}   newName [description]
 * @param  {Function} fn      [description]
 * @return {[type]}           [description]
 */
export default function gbMin(name,newName,fn) {
	if(fn === undefined && typeof newName === 'function') {
		fn = newName;
		newName = undefined;
	}
	newName = newName || name;
	fn = fn || minOp;
	function min(action,accum,count, val) {
		if( accum === undefined ) accum = fn(val,'');
		return (isEmpty(val) || action !== 1)?[accum,count]:[fn(val,accum)<0?val:accum,count+1];
	}
	return [min,name,[() => undefined,0],newName];
}

function minOp(a,b) { return cmpStrNum(a,b)<0?a:b; }



