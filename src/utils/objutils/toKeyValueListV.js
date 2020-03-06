
import {flatten} from '../../array/flatten';
/**
 * [toKeyValueListV description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export default function toKeyValueListV(obj) {
	let expand = Object.keys(obj).map(doExpand);
	return flatten(expand,1);
	function doExpand(k) {
		let v = obj[k];
		if( v.length == 1) {
			let res = [k, v[0]];
			return [res];
		}
		return v.map( e => [k, e]);
	}
}

