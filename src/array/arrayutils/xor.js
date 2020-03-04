
import newArray from './newArray';

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
export default  function xor(array1, array2) {
	let ixa =  arrIntersect(array1,array2);
	//console.log(ixa)
	let set = new Set(ixa);
	let len = ixa.length; ixa = undefined;
	let res = newArray(array1.length + array2.length - 2*len,null);
	//console.log("len",res.length)
	let j=0;
	len = array1.length;
	for(let i=0; i<len; i++ ) {
		let v = array1[i];
		if( !set.has(v) ) res[j++] = v;
	}
	len = array2.length;
	for(let i=0; i<len; i++ ) {
		let v = array2[i];
		if( !set.has(v) ) res[j++] = v;
	}
	//console.log("len 1", j)
	res.length = j;

	return res;
}

