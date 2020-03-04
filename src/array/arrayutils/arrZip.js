
import newArray from './newArray';

/**
 * zip and array, given an array of columns (each element is a column of values) converts and array of column arrays to and array row arrays
 * @param  {Aarry} arrays array of column arrays
 * @return {Array}           array of row arrays - [ [arrays[0][0],arrays[1][0], arrays[2][0], ... ], [arrays[0][1],arrays[1][1], arrays[2][1], ... ]
 */
export default  function arrZip(...arrays) {
	let mx = arrMax(a=>a.length,arrays);
	const cnt = arrays.length;
	let res = newArray(mx,null);
	for(let i=0; i<mx; i++) {
		let el = [];
		for(let j=0; j<cnt; j++){
			el.push(arrays[j][i]);
		}
		res[i] = el;
	}
	return res;
}

