
import newArray from '../../array/arrayutils/newArray'
/**
 * [genObjMapper description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export default function genObjMapper(obj) {
	let keys = Object.keys(obj);
	let mapper = keys.reduce((o,v,ix) => setKey(o,v,ix), {});
	let len = keys.length;
	return [ //mapper func, colm array
		(obj) => {
			let arr = newArray(len,null);
			for(let i=0; i<len; i++) {
				let k = keys[i];
				arr[mapper[k]] = obj[k];
			}
			return arr;
		}, 
		keys
	] ;
}

