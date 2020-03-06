
import isArray from '../../utils/types/isArray';

/**
 * Add two vectors
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
export default  function vecAdd(a1,a2) {
	if(a1 === undefined ){
		if(Array.isArray(a2)) return a2.slice();
		else return undefined;
	} else  if(a2 === undefined ){
		if(Array.isArray(a1)) return a1.slice();
		else return undefined;
	} else if(a1.length < a2.length) {
		return a2.map((v,i) => v+(a1[i]||0));
	} else return a1.map((v,i) => v+(a2[i]||0));
}

