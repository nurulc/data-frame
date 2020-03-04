
/**
 * array subtraction arr - listToRemove  (return an array with all elements
 * of arr this is not in listToRemove)
 * @param  {Array} arr
 * @param  {Array} listToRemove
 * @return {Array} new array that contains all values of (arr) that are not in listToRemove
 */
export default  function arrRemove(arr, listToRemove) {
	if(!listToRemove || listToRemove.length === 0) return arr || [];
	if(!arr || arr.length === 0) return [];
	return arr.filter( e => listToRemove.indexOf(e) === -1);
}


