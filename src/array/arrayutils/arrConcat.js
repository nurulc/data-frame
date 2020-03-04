

// concatinate a list of arrays
/**
 * concatinate a list of arrays
 * @param  {Array} arrays [description]
 * @return {Array}           [description]
 */
export default  function arrConcat(...arrays) {
	return Array.prototype.concat.apply([], arrays);
}

