//objutils.js
// import {memoize,access,setKey, timeIt,toKeyValueList, fromKeyValueList} from './objutils'
import {newArray} from '../array/arrayutils';
import {flatten} from '../array/flatten';

export const isA = {
	array: function isArray(arr) {
		if( !arr) return null;
		return (arr.constructor === Array)?arr:undefined;
	},

	func: function isFunc(fun) {return (typeof fun === 'function')?fun:undefined; },
	str: function isStr(str) {return (typeof str === 'string')?str:undefined; },
	num: function isNum(num) {return (typeof num === 'number')?num:undefined; },
	bool: function isBool(val) {return (typeof val === 'boolean')?val:undefined; },
	obj: function(obj) {return (!Array.isArray(obj) && typeof obj === 'object')?obj:undefined; },
	map: function(aMap) {return (aMap instanceof Map)?aMap:undefined; },
	set: function(aSet) {return (aSet instanceof Set)?aSet:undefined; }
};

 
export function keys(obj) {
	return obj? Object.keys(obj): [];
}


/**
 * extract elements of an object, or from a list of elements
 * 	pick(key) => returns a function that takes an object and returns an elemnt 
 *  pick(keyList) => returns a function that takes an object and returns an array of element values
 *
 * @param  {String} list   String or array of strings
 * @return {function}      function that takes an object and returns the key or an array of keys
 */
export const pick = memoize(pickRaw);

/**
 * [pickRaw description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
export function pickRaw(list) {
	if(!list) return () => [];
	if( isA.array(list))
		return ( (obj) => list.map(k => obj[k])  );
	else {
		let k = list;
		return (obj => obj[k]);
	}
}
/**
 * [memoize description]
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
export function memoize(fn) {
	let memo = {};
	return (arg) => {
		let v = memo[arg];
		if( v !== undefined ) return v;
		v = fn(arg);
		return memo[arg] = v; 
	};
}

// Builds an accessor function for obj element key
// akey = access('akey);  then akey(obj) same as obj.akey,   
//                      akey(obj,value) same as obj.akey = value, ,
//                      but returns the obj and not the value you assigned 

/**
 * [description]
 * @param  {[type]} key) {		return    function(obj,v) {			if(arguments.length [description]
 * @return {[type]}      [description]
 */
export const access = memoize(
	function (key) {
		return function(obj,v) {
			if(arguments.length == 1) return obj[key];
			else {
				obj[key] = v;
				return obj;
			}
		};  
	}
);

/**
 * [setKey description]
 * @param {[type]} obj [description]
 * @param {[type]} key [description]
 * @param {[type]} v   [description]
 */
export function setKey(obj,key,v) {
	if(arguments.length === 1) throw new Error("too few arguments");
	if(arguments.length === 2) 
		return obj[key];
	else {
		obj[key] = v;
		return obj;
	}
}

/**
 * [toKeyValueList description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export function toKeyValueList(obj) {
	return Object.keys(obj).map( k => [k, obj[k]]);
}


/**
 * [fromKeyValueList description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
export function fromKeyValueList(list) {
	return list.reduce( (tab,[k,v]) => setKey(tab, k, v),{});
}

/**
 * [setKeyV description]
 * @param {[type]} obj [description]
 * @param {[type]} key [description]
 * @param {[type]} v   [description]
 */
export function setKeyV(obj,key,v) {
	if(arguments.length == 1) 
		return obj[key];
	else if( v === undefined) return obj;
	else {
		let res = obj[key];
		if( res ) res.push(v);
		else obj[key] = [v];
		return obj;
	}
}

/**
 * [toKeyValueListV description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export function toKeyValueListV(obj) {
	let expand = Object.keys(obj).map(doExpand);
	return flatten(expand,1);
	function doExpand(k) {
		let v = obj[k];
		if( v.length == 1) {
			let res = [k, v[0]];
			return [res];
		}
		return v.map( e => [k, e]);
	}
}

/**
 * [fromKeyValueListV description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
export function fromKeyValueListV(list) {
	return list.reduce( (tab,[k,v]) => setKeyV(tab, k, v),{});
}

/**
 * [genObjMapper description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export function genObjMapper(obj) {
	let keys = Object.keys(obj);
	let mapper = keys.reduce((o,v,ix) => setKey(o,v,ix), {});
	let len = keys.length;
	return [ //mapper func, colm array
		(obj) => {
			let arr = newArray(len,null);
			for(let i=0; i<len; i++) {
				let k = keys[i];
				arr[mapper[k]] = obj[k];
			}
			return arr;
		}, 
		keys
	] ;
}

export const mapOver = curry2(function (fn, object) {
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

// =============== shallow equality ===================
export function shallow(a, b, compare) {
	var aIsNull = a === null;
	var bIsNull = b === null;

	if (aIsNull !== bIsNull) return false;

	var aIsArray = Array.isArray(a);
	var bIsArray = Array.isArray(b);

	if (aIsArray !== bIsArray) return false;

	var aTypeof = typeof a;
	var bTypeof = typeof b;

	if (aTypeof !== bTypeof) return false;
	if (flat(aTypeof)) return compare ? compare(a, b) : a === b;

	return aIsArray ? shallowArray(a, b, compare) : shallowObject(a, b, compare);
}

function shallowArray(a, b, compare) {
	var l = a.length;
	if (l !== b.length) return false;

	if (compare) {
		for (let i = 0; i < l; i++)
			if (!compare(a[i], b[i])) return false;
	} else {
		for (let i = 0; i < l; i++) {
			if (a[i] !== b[i]) return false;
		}
	}

	return true;
}

function shallowObject(a, b, compare) {
	var ka = 0;
	var kb = 0;

	if (compare) {
		for (var key in a) {
			if (
				a.hasOwnProperty(key) &&
        !compare(a[key], b[key])
			) return false;

			ka++;
		}
	} else {
		for (let key in a) {
			if (a.hasOwnProperty(key) && a[key] !== b[key] ) return false;
			ka++;
		}
	}

	for (let key in b) {
		if (b.hasOwnProperty(key)) kb++;
	}

	return ka === kb;
}

function flat(type) { return (type !== 'function' && type !== 'object'); }

export function filterDict(aDict, listOrFunc) {
	if( !listOrFunc ) return aDict;
	if( Array.isArray(listOrFunc)) {
		return listOrFunc.reduce((dict,v) => { if(aDict[v]) dict[v] = aDict[v]; return dict; }, new Map());
	} else if( isA.function(listOrFunc) ) {
		return listOrFunc(aDict).reduce((dict,v) => { if(aDict[v]) dict[v] = aDict[v]; return dict; }, new Map());
	}
	return aDict;
}

function TRUE() { return true; }

/*
  create a function that tests for elements in aListOrStringOrEmpty
    aListOrStringOrEmpty => undefined - allows everything
    aListOrStringOrEmpty => [... names ] - allow only the elelemnts in the list 
    aListOrStringOrEmpty => <single string Name> (string) - allow only single name 

*/
export function genFilterFunction(aListOrStringOrEmpty) {
	if(aListOrStringOrEmpty === undefined) return TRUE;
	if(typeof aListOrStringOrEmpty === 'string') return (v => v === aListOrStringOrEmpty); // single name filter
	if(Array.isArray(aListOrStringOrEmpty)) return (v => aListOrStringOrEmpty.indexOf(v) !== -1); // matches a list
	throw new Error('Unexpected type - expected endefined, a string, or and array of string');
}

