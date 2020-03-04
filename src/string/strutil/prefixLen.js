
/**
 * Find the length of the longest prefix of a and b string
 *    if a = pre + a1  and b = pre + b1
 *    pre is the longet sting that satisfies the relationship i.e.  prefixLen(a1,b1) === 0
 *    returns (pre.length )
 * @param  {string} a  first string
 * @param  {string} b  second string
 * @return {Number} length of prefix of a and b
 */
export default  function prefixLen(a,b) {
	if( a === b ) return a.length;
	let la = a.length, lb = b.length; 
	if( lb < la) la = lb;
	for(let i=0; i < la; i++) {
		if(a[i] !== a[i]) return i+ln
	}
	return la+ln;    
}
