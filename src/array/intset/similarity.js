
/**
 * Show how similar two sets (sorted list) actually are
 * @param  {[Array]} sortedA [description]
 * @param  {[Array]} sortedB [description]
 * @return {[Array]}         where the array contains[same_count, different_count]
 */
export default  function similarity(sortedA, sortedB) {
	let j=0;
	let lenA = sortedA.length;
	let lenB = sortedB.length;
	let same = 0;
	for(let i =0; i< lenA && j< lenB;i++) {
		let iA = sortedA[i];
		if(iA == sortedB[j]) {
			same++;
			j++;
		} else {
			while(j<lenB && iA > sortedB[j]) j++;
					
			if( j == lenB) break;
			if(iA == sortedB[j]) {
				same++
				j++;
			}
		}
	}
	return [same, lenA+lenB-2*same];   
}

