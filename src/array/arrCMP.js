
/**
 * Compare array, assumes the arry is sorted
 * returns -1, 0, +1  as required by a sotring compare function
 * @param  {[sorted_elements]} arr1
 * @param  {[sorted_elements]} arr2
 * @return {integer} -1 = less, 0 = equal, +1 = larger
 */
export default function arrCMP(arr1,arr2) {
	if( arr1 === arr2) return 0;

	let len = Math.min(arr1.length, arr2.length);
	let i=0;

	// some optimization reduce loop overhead cost
	if( len > 4 ){
		let len1 = len - (len&3);
		for(; i<len1; i += 4) {
			let a = arr1[i], b = arr2[i];
			if(a < b) return -1;
			if(a > b) return 1;

			a = arr1[i+1], b = arr2[i+1];
			if(a < b) return -1;
			if(a > b) return 1;

			a = arr1[i+2], b = arr2[i+2];
			if(a < b) return -1;
			if(a > b) return 1;

			a = arr1[i+3], b = arr2[i+3];
			if(a < b) return -1;
			if(a > b) return 1;
		}
	}
	for(i; i<len; i++) {
		let a = arr1[i], b = arr2[i];
		if(a < b) return -1;
		if(a > b) return 1;  
	}
	return 0;
}