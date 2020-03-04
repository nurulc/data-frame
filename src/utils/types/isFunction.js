
/**
 * is obj a function
 * @param  {any} fun - is a object that may be a function object
 * @return {boolean} - true if it is a function, false otherwise
 */
export default function isFunction(fun) {
	return (typeof fun === 'function')?fun:null;
}

