/*local*/
import {isA} from './isA';
/**
 * [pickRaw description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
export default function pickRaw(list) {
	if(!list) return () => [];
	if( isA.array(list))
		return ( (obj) => list.map(k => obj[k])  );
	else {
		let k = list;
		return (obj => obj[k]);
	}
}
