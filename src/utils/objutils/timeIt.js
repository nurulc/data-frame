
/**
 * [timeIt description]
 * @param  {[type]}   count [description]
 * @param  {Function} fn    [description]
 * @param  {String}   name  [description]
 * @return {[type]}         [description]
 */
export function timeIt(count,fn,name='func') {
	let t0 = new Date().getTime();
	for(let i=0; i<count; i++) {
		fn();
	}
	let t1 = new Date().getTime();
	console.log('Call to '+name+' took ' + (t1 - t0) + ' milliseconds.');
}

