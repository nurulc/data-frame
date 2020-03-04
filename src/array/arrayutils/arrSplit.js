
/**
 * split an array into n more or less equal length arrays
 * @param  {int} n
 * @param  {Array} arr
 * @return {Array} - return an array of arrays where each inner array is approximately of length n or less
 */
export default  function arrSplit(n,arr) {
	if( n<= 0) throw new Error('array cannot be split to chunks < 0 : \''+n+'\'');
	if(arguments.length === 1) return (arr) => arrSplit(n,arr); // return a function
	let len = arr.length;
	if(n >= len) return [arr];
	let res = [],i;
	for(i=n; i<len; i+= n) {
		res.push(arr.slice(i-n,i));
	}
	res.push(arr.slice(i-n));
	return res;
}

