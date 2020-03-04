 
/**
 * Check if an array is empty or an object has no attributes
 * @param  {[Any]} arrOrObj
 * @return {[Boolean]} - true if empty array or empty object
 */
export default function isEmpty(arrOrObj) {
	if(!arrOrObj) return true;
	if(isArray(arrOrObj) && arrOrObj.length === 0) return true;
	if(typeof arrOrObj === 'object' && 
			Object.keys(arrOrObj).length === 0 ) return true;
	return false;
}

