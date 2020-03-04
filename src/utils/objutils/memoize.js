
/**
 * [memoize description]
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
export default function memoize(fn) {
	let memo = {};
	return (arg) => {
		let v = memo[arg];
		if( v !== undefined ) return v;
		v = fn(arg);
		return memo[arg] = v; 
	};
}

