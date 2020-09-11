/**
 * Tests array for equality
 * @param  {[elements]} arr1
 * @param  {[elements]} arr2
 * @param  {Function} eqFn
 * @return {boolean}
 */
export default   function arrEQ(arr1,arr2, eqFn) {
	if( arr1 === arr2) return true;
	if(arr1.length !== arr2.length) return false;
	if(typeof eqFn === 'function') return _arrayEqual(arr1,arr2, eqFn);
	let len = Math.min(arr1.length, arr2.length);
	let i=0;
	if( len >= 8) {
		let len1 = len - (len&7);
		for(; i<len1; i += 8) {
			if(arr1[i]   !== arr2[i])   return false;
			if(arr1[i+1] !== arr2[i+1]) return false;
			if(arr1[i+2] !== arr2[i+2]) return false;
			if(arr1[i+3] !== arr2[i+3]) return false;
			if(arr1[i+4] !== arr2[i+4]) return false;
			if(arr1[i+5] !== arr2[i+5]) return false;
			if(arr1[i+6] !== arr2[i+6]) return false;
			if(arr1[i+7] !== arr2[i+7]) return false;
		} 
	} 
	if( len >= 4 ){
		let len1 = len - (len&3);
		for(; i<len1; i += 4) {
			if(arr1[i]   !== arr2[i])   return false;
			if(arr1[i+1] !== arr2[i+1]) return false;
			if(arr1[i+2] !== arr2[i+2]) return false;
			if(arr1[i+3] !== arr2[i+3]) return false;
		}    
	}

	switch(len-i) {
	case 3: if(arr1[i+2] !== arr2[i+2]) return false;
	case 2: if(arr1[i+1] !== arr2[i+1]) return false;
	case 1: if(arr1[i] !== arr2[i]) return false;
	}

	return true;
}

function _arrayEqual(a,b, eq) {
	for(let i= 0; i< a.length; i++ ) if( !eq(a[i],b[i] ) ) return false;
	return true;
}