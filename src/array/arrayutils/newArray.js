
/**
 * create a new array of length n
 * @param  {integer} n [description]
 * @param  {value} v optional value to initialize the array
 * @return {Array}   [description]
 */
export default  function newArray(n,v) { // seems to be faster way to create an array
	let a = new Array(n);
	if( v === undefined) {
		return a;
	} else {
		for(let i=0; i<n; i++) {
			a[i] = v;
		}
		return a;
	}
}
