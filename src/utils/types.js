 
/**
 * Check if an array is empty or an object has no attributes
 * @param  {[Any]} arrOrObj
 * @return {[Boolean]} - true if empty array or empty object
 */
export function isEmpty(arrOrObj) {
	if(!arrOrObj) return true;
	if(isArray(arrOrObj) && arrOrObj.length === 0) return true;
	if(typeof arrOrObj === 'object' && 
			Object.keys(arrOrObj).length === 0 ) return true;
	return false;
}

// 
/**
 * is the arr/object an array
 * @param  {any} arr
 * @return {Boolean}
 */
function isArray(arr) {
	if( !arr) return undefined;
	return (arr.constructor === Array || ArrayBuffer.isView(arr))?arr:undefined;
}

/**
 * is obj a function
 * @param  {any} fun - is a object that may be a function object
 * @return {boolean} - true if it is a function, false otherwise
 */
function isFunction(fun) {
	return (typeof fun === 'function')?fun:null;
}

// 
/**
 * is str a string
 * @param  {String} str
 * @return {boolean} - true if str is a string
 */
function isString(str) {
	return (typeof str === 'string')?str:null;
}

