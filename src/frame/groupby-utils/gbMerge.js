
import isEmpty from '../../utils/types/isEmpty';
import {arrDedup } from '../../array';
import accStr from './accStr';

/**
 * [gbMerge description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @param  {[type]} sep     [description]
 * @return {[type]}         [description]
 */
export default function gbMerge(name,newName,sep) {
	newName = newName || name;
	sep = sep || ', ';
	function merge(action,accum,count, val) {
		if( accum === undefined ) accum = [];
		if( action !== 1) return [(accum.length===1?accum[0]:accum.join(sep)), count];
		return isEmpty(val) ?[accum,count]:[accStr(accum,val),count+1];
	}
	return [merge,name,[() => [],0],newName];
}

