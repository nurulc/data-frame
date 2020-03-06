
import isEmpty from '../../utils/types/isEmpty';
/**
 * [gbCount description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
export default function gbCount(name,newName) {
	newName = newName || name;
	function count(action,accum,count, val) {
		if( accum === undefined ) accum = 0;
		if( action !==1 ) return [count,count];
		return isEmpty(val)?[accum,count]:[accum+1,count+1];
	}
	return [count,name,[()=> 0, 0 ] ,newName];
}

