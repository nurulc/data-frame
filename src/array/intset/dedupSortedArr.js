
 
/**
 * removes all duplicates in a sorted array, pure function - does not modify the input
 * @param  {[Array]} arr assumes the array is sorted (will throw an exception if the array is not sorted)
 * @return {[Array]} returns a new array with no duplicates 
 */
export default function dedupSortedArr(arr) {
	if( arr.length === 0) return arr;
	let res = [];
	let len=arr.length-1;
	for(let i=0;i<len;i++){
		if(arr[i] > arr[i+1]) throw new Error("arr (param) is not sorted");
		if(arr[i] !== arr[i+1]){
			res.push(arr[i]);
		}
	}
	res.push(arr[len]);
	return res;
}

