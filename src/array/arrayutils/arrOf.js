
/**
 * create an array of same values (aVal) where the result has n of those values
 * @param  {any} aVal  - a value to duplicate n times
 * @param  {int32} n    number of occurences in the array
 * @return {Array}      - Array of length (n) all filled aValue
 */
export default function arrOf(aVal,n) {
	let v = [];
	// TODO: hndle if val is a function
	if(typeof aVal === 'function')
		for(var i=0; i<n; i++) v.push(aVal(i));
	else for(var i=0; i<n; i++) v.push(aVal);
	return v;
}

