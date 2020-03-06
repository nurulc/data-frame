// jshint undef:true
// jshint unused:true
/*
Copyright (c) 2020, Nurul Choudhury
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/


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

