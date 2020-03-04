
/**
 * is the arr/object an array
 * @param  {any} arr
 * @return {Boolean}
 */
export default function isArray(arr) {
	if( !arr) return undefined;
	return (arr.constructor === Array || ArrayBuffer.isView(arr))?arr:undefined;
}

