export default  function colEQ(arr1,arr2) {
	if( arr1 === arr2) return true;
	if(arr1.length !== arr2.length) return false;

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
		len -= len1;  
	} 
	if( len >= 4 ){
		//let len1 = len - (len&3);
		//for(; i<len1; i += 4) {
		if(arr1[i]   !== arr2[i])   return false;
		if(arr1[i+1] !== arr2[i+1]) return false;
		if(arr1[i+2] !== arr2[i+2]) return false;
		if(arr1[i+3] !== arr2[i+3]) return false;
		//}    
		len -= 4;
		i += 4;
	}

	switch(len) {
	case 3: if(arr1[i+2] !== arr2[i+2]) return false;
	case 2: if(arr1[i+1] !== arr2[i+1]) return false;
	case 1: if(arr1[i] !== arr2[i]) return false;
	}
	// for(; i<len; i++) {
	// 	if(arr1[i] !== arr2[i]) return false;
	// }
	return true;

}
