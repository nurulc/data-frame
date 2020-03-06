
/**
 * is the arr/object an array
 * @param  {any} arr
 * @return {Boolean}
 */
export default function isArray(arr) {
	if( !arr) return null;
	if(Array.isArray(arr)) return arr;
	return (arr.constructor === Array || ArrayBuffer.isView(arr))?arr:null;
}

