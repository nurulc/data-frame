
/**
 * [safeDedup description]
 * @param  {Array} list [description]
 * @return {Array}      [description]
 */
export default  function safeDedup(list) {
	let len = list.length;
	let res = [];
	for(let i=0; i<len; i++){
		let v = list[i];
		if(res.indexOf(v) === -1) res.push(v);
	}
	return res;
}


