
// modifies the input array
export default function trimListElements(arr) {
	let len = arr.length;
	for(let i=0; i<len; i++) {
		let s = arr[i];
		if( s === '' || s === undefined) s = '';
		else s = s.trim();
		arr[i] = s;
	}
	return arr;
}
