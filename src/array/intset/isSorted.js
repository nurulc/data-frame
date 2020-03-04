
/**
 * checks if array is sorted, pure function - does not modify the input
 * @param  {[string|number]}  arr - Array of values
 * @return {[boolean]}     - true if the array is sorted, false otherwise (undefined is not a sorted set)
 */
export default function isSorted(arr /* may not be sorted sorted*/) {
	let len=arr.length-1;
	for(let i=0;i<len;i++){
		if(arr[i]>arr[i+1]){
			return  false;
		}
	}
	return true;
}



