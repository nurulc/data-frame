
/**
 * function to take the hash of an array of integers
 * @param {[int]} arrOfInt array of integers
 */
export function setHash(arrOfInt) {
	var hash = 5381,
		i    = arrOfInt.length ;
	if( i > 5 ) i=5;
	let j=i;
	while(i--) {
		hash = (hash * 33) ^ arrOfInt[j-i];
	}

	/* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
	 * integers. Since we want the results to be always positive, convert the
	 * signed int to an unsigned by doing an unsigned bitshift. */
	return hash >>> 0;    
}

