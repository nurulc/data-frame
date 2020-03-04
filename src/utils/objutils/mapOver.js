

export default  curry2(function (fn, object) {
	if(!object) return object;
	if(Array.isArray(object)) {
		let list = object;
		return list.map(fn);
	}
	else if( typeof object === 'object') {
		return Object.keys(object).reduce((obj,k,ix) => (obj[k] = fn(object[k],ix), obj),{});
	}
	else if(typeof object.map === 'function'){
		// babel - do not transform map into array iteration
		// O: KEEP
		return object.map(fn);
	}
	else return fn(object);
});

function curry2(fn) {
	if(typeof fn !== 'function') throw new Error('fn:('+fn+') function expected');
	if( fn.length < 2 ) return fn;
	return function _fn(...list) {

		switch( list.length ) {
		case 0: return _fn;
		case 1: {
			let a = list[0];
			return (...args) => fn(a,...args);
		}
		default: {
			return fn(...list);
		} 
		}
	};
}

