
/**
 * is obj a function
 * @param  {any} fun - is a object that may be a function object
 * @return {boolean} - true if it is a function, false otherwise
 */
export default function isFunction(fun) {
	if(typeof fun === 'function') return fun;
	return !!(fun && fun.call && fun.apply)?fun:null;
}

