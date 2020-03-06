
import {toNumber} from '../../utils/sort-helper';
/**
 * [gbSum description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
export default function gbSum(name,newName) {
	newName = newName || name;
	function sum(action,accum,count, val) {
		if( accum === undefined ) accum = 0;
				
		if( action !==1 ) return  [accum,count];
		else {
			let v = toNumber(val);
			return  v===undefined || isNaN(v) ?[accum,count]:[accum+v,count+1];
		}
	}
	return [sum,name,[()=>0,0],newName];
}

