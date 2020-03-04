
/**
 * reverse a string
 * @param  {string} s string to reverse
 * @return {string}   reversed string
 */
export default  function reverse(s) { // 1100ms
	let o = '';
	for (var i = s.length - 1; i >= 0; i--)
		o += s[i];
	return o;
}
