

/**
 * checks if sorted array has no dups, pure function - does not modify the input
 * @param  {[Array]}  arr - sorted set of values
 * @return {[Boolean]}     - true if the sorted array has no diplicated, false otherwise (undefined is not a sorted set)
 */
export default function hasNoDups(arr /*sorted*/) {
	if( !arr ) return false
	let len=arr.length-1;
	for(let i=0;i<len;i++){
		if(arr[i] > arr[i+1]) throw new Error("arr (param) is not sorted");
		if(arr[i]===arr[i+1]) {
			return  undefined;
		}
	}
	return arr;
}

