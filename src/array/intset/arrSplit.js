
/**
 * Split an array into an array of arrays each with equal parts, expect possibly for the last element
 * @param  {[type]}
 * @return {[type]}
 */
export default function arrSplit(list) {
	let len = list.length;
	let half = len >>> 1;
	return [list.slice(0,half), list.slice(len-half)];
}



