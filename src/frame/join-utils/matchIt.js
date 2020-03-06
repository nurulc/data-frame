/*local*/ 
/**
 * leftJoin on one row from left and arr from right
 * @param  {[type]} res
 * @param  {[type]} row1
 * @param  {[type]} arr
 * @param  {[type]} cmp
 * @param  {[type]} tr
 * @return {[[row-element]} 
 */
export default function matchIt(res,row1,arr, cmp, tr) {
	let len,  cnt =0;
	if( !arr || arr.length === 0 ) len = 0;
	else len = arr.length;
	let transform = tr[0];
	
	for(let i=0; i< len; i++) {
		let row2 = arr[i];
		if(cmp(row1,row2)) {
			res.push(transform(row1,row2));
			cnt++;
		}
	}
	if( cnt === 0 ) {
		transform = tr[1];
		res.push(transform(row1,[]));
	}
	return res;
}

