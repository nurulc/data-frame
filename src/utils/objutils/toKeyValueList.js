
/**
 * [toKeyValueList description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export default function toKeyValueList(obj) {
	return Object.keys(obj).map( k => [k, obj[k]]);
}

