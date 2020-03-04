

/**
 * is str a string
 * @param  {String} str
 * @return {boolean} - true if str is a string
 */
function isString(str) {
	return (typeof str === 'string')?str:null;
}
/**
 * [arrCountVal description]
 * @param  {[type]} list [description]
 * @param  {[type]} v    [description]
 * @return {[type]}      [description]
 */
export function arrCountVal(list,v) {
	v = isString(v) ? (v?v.trim():''):v;
	let len = list.length;
	let count = 0;
	for(let i=0; i<len; i++) {
		if(list[i] === v) count++;
	}
	return count; //list.reduce((cnt,e) => (e || '').trim() == v ? cnt+1 : cnt, 0);
}


