
import {strHash} from '../../string/strdict';

export default  function arrHash(arr) {
	let len = arr.length;
	let hash = 0;
	for(let i=0; i<len;i++) {
		hash=(hash*13|0)+(strHash(arr[i])|0);
	}
	return hash;
}

