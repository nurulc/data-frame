
/**
 * count the number of occurences of char in the string
 * @param  {string} data  [description]
 * @param  {char} char  [description]
 * @param  {[int32]} arr   optional array to place the index of char in string
 * @param  {int32} optional start start index of the string
 * @param  {int32} end   optional last index of the string
 * @return {int32}       number of occurences of the char in the string
 */
export default  function countCh(data, char, arr, start, end) {
	let i = Math.min(end || data.length, data.length);
	start = start || 0;
	let ch = char.charCodeAt(0)|0;   
	let ix = 1;
	if( arr !== undefined) {
		let end = i;
		i = start;
		arr[0] = i;
		while(i < end) 
			if(data.charCodeAt(i++) === ch) arr[ix++] = i;
	}
	else {
		while(i > start) 
			if(data.charCodeAt(--i) === ch) ix++;
	}
	return ix;
}