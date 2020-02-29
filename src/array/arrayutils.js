//arrayutils.js
import {strHash} from '../string/strdict';

 
/**
 * Check if an array is empty or an object has no attributes
 * @param  {[Any]} arrOrObj
 * @return {[Boolean]} - true if empty array or empty object
 */
export function isEmpty(arrOrObj) {
	if(!arrOrObj) return true;
	if(isArray(arrOrObj) && arrOrObj.length === 0) return true;
	if(typeof arrOrObj === 'object' && 
			Object.keys(arrOrObj).length === 0 ) return true;
	return false;
}

// 
/**
 * is the arr/object an array
 * @param  {any} arr
 * @return {Boolean}
 */
function isArray(arr) {
	if( !arr) return undefined;
	return (arr.constructor === Array || ArrayBuffer.isView(arr))?arr:undefined;
}

/**
 * is obj a function
 * @param  {any} fun - is a object that may be a function object
 * @return {boolean} - true if it is a function, false otherwise
 */
function isFunction(fun) {
	return (typeof fun === 'function')?fun:null;
}

// 
/**
 * is str a string
 * @param  {String} str
 * @return {boolean} - true if str is a string
 */
function isString(str) {
	return (typeof str === 'string')?str:null;
}


/**
 * create a new array of length n
 * @param  {integer} n [description]
 * @param  {value} v optional value to initialize the array
 * @return {Array}   [description]
 */
export function newArray(n,v) { // seems to be faster way to create an array
	let a = new Array(n);
	if( v === undefined) {
		return a;
	} else {
		for(let i=0; i<n; i++) {
			a[i] = v;
		}
		return a;
	}
}

/**
 * Get the last element of an array
 * 
 * @param  {[type]} arr      [description]
 * @param  {String} defaultV [description]
 * @return {[type]}          [description]
 */
export function last(arr,defaultV='') {
	if(!Array.isArray(arr))  return undefined;
	if( !arr || arr.length === 0) return defaultV;
	return arr[arr.length-1];
}

// 
/**
 * create an array of same values (aVal) where the result has n of those values
 * @param  {any} aVal  - a value to duplicate n times
 * @param  {int32} n    number of occurences in the array
 * @return {Array}      - Array of length (n) all filled aValue
 */
export function arrOf(aVal,n) {
	let v = [];
	// TODO: hndle if val is a function
	if(typeof aVal === 'function')
		for(var i=0; i<n; i++) v.push(aVal(i));
	else for(var i=0; i<n; i++) v.push(aVal);
	return v;
}

export function arrHash(arr) {
	let len = arr.length;
	let hash = 0;
	for(let i=0; i<len;i++) {
		hash=(hash*13|0)+(strHash(arr[i])|0);
	}
	return hash;
}


/**
 * array subtraction arr - listToRemove  (return an array with all elements
 * of arr this is not in listToRemove)
 * @param  {Array} arr
 * @param  {Array} listToRemove
 * @return {Array} new array that contains all values of (arr) that are not in listToRemove
 */
export function arrRemove(arr, listToRemove) {
	if(!listToRemove || listToRemove.length === 0) return arr || [];
	if(!arr || arr.length === 0) return [];
	return arr.filter( e => listToRemove.indexOf(e) === -1);
}



/**
 * split an array into n more or less equal length arrays
 * @param  {int} n
 * @param  {Array} arr
 * @return {Array} - return an array of arrays where each inner array is approximately of length n or less
 */
export function arrSplit(n,arr) {
	if( n<= 0) throw new Error('array cannot be split to chunks < 0 : \''+n+'\'');
	if(arguments.length === 1) return (arr) => arrSplit(n,arr); // return a function
	let len = arr.length;
	if(n >= len) return [arr];
	let res = [],i;
	for(i=n; i<len; i+= n) {
		res.push(arr.slice(i-n,i));
	}
	res.push(arr.slice(i-n));
	return res;
}


/**
 * zip and array, given an array of columns (each element is a column of values) converts and array of column arrays to and array row arrays
 * @param  {Aarry} arrays array of column arrays
 * @return {Array}           array of row arrays - [ [arrays[0][0],arrays[1][0], arrays[2][0], ... ], [arrays[0][1],arrays[1][1], arrays[2][1], ... ]
 */
export function arrZip(...arrays) {
	let mx = arrMax(a=>a.length,arrays);
	const cnt = arrays.length;
	let res = newArray(mx,null);
	for(let i=0; i<mx; i++) {
		let el = [];
		for(let j=0; j<cnt; j++){
			el.push(arrays[j][i]);
		}
		res[i] = el;
	}
	return res;
}

// concatinate a list of arrays
/**
 * concatinate a list of arrays
 * @param  {Array} arrays [description]
 * @return {Array}           [description]
 */
export function arrConcat(...arrays) {
	return Array.prototype.concat.apply([], arrays);
}

// return the difference of two arrays same as arr1 xor arr2
/**
 * return the difference of two arrays same as arr1 xor arr2
 * @param  {Array} arr1 [description]
 * @param  {Array} arr2 [description]
 * @return {Array}      [description]
 */
export function arrDiff(arr1, arr2) {
	let array = {};
	if (!isArray(arr1) || !isArray(arr2)) {
		throw new TypeError('Invalid argument, Please pass proper array argument');
	}

	var result = [];
	for (let i = 0; i < arr2.length; i++) {
		array[arr2[i]] = arr2[i];
	}

	for (let i = 0; i < arr1.length; i++) {
		if (array[arr1[i]] === undefined)
			result.push(arr1[i]);
	}
	return result;
}

// return the union of two arrays
/**
 * return the union of two arrays
 * @param  {Array} arr1 [description]
 * @param  {Array} arr2 [description]
 * @return {Array}      [description]
 */
export function arrUnion(arr1, arr2) {

	if(!arr1|| arr1.length === 0) return arr2 || [];
	if(!arr2|| arr2.length === 0) return arr1 || [];

	var aSet = new Map();
	if (!isArray(arr1) || !isArray(arr2)) {
		throw new TypeError('Invalid argument, Please pass proper array argument');
	}

	let result = [];
	for (let i = 0; i < arr1.length; i++) {

		if (aSet.get(arr1[i]) === undefined) {
			aSet.set(arr1[i],arr1[i]);
			result.push(arr1[i]);
		}
	}

	for (let i = 0; i < arr2.length; i++) {

		if (aSet.get(arr2[i]) === undefined) {
			result.push(arr2[i]);
			aSet.set(arr2[i], arr2[i]);
		}
	}
	return result;
}

// return the intersection of two arrays
/**
 * return the intersection of two arrays
 * @param  {Array} arr1 [description]
 * @param  {Array} arr2 [description]
 * @return {Array}      [description]
 */
export function arrIntersect(arr1, arr2) {
	var array = {};
	if (!isArray(arr1) || !isArray(arr2)) {
		throw new TypeError('Invalid argument, Please pass proper array argument');
	}

	var result = [];
	for (var i = 0; i < arr1.length; i++) {

		if (array[arr1[i]] === undefined)
			array[arr1[i]] = arr1[i];
	}

	for ( i = 0; i < arr2.length; i++) {
		if (array[arr2[i]] !== undefined) {

			result.push(arr2[i]);
			array[arr2[i]] = undefined;
		}
	}
	return result;
}

export function xor(array1, array2) {
	let ixa =  arrIntersect(array1,array2);
	//console.log(ixa)
	let set = new Set(ixa);
	let len = ixa.length; ixa = undefined;
	let res = newArray(array1.length + array2.length - 2*len,null);
	//console.log("len",res.length)
	let j=0;
	len = array1.length;
	for(let i=0; i<len; i++ ) {
		let v = array1[i];
		if( !set.has(v) ) res[j++] = v;
	}
	len = array2.length;
	for(let i=0; i<len; i++ ) {
		let v = array2[i];
		if( !set.has(v) ) res[j++] = v;
	}
	//console.log("len 1", j)
	res.length = j;

	return res;
}

export function redim(arr, n) {
	let result = [];
	let len = arr.length;
	let len_n = len+n-1;
	let _v = arr[0];
	for (var i = 0; i < len_n; i += n) {
		if(len-i <= 0) break;
		var r = newArray(Math.min(n, len-i), _v);
		var j=0;
		for(; j<n && i+j<len; j++) {
			r[j] = arr[i+j];
		}
		r.length = j;
		result.push(r);
	}
	return result;
}

// add 2 vectors
export function vecAdd(a1,a2) {
	if(a1 === undefined ){
		if(Array.isArray(a2)) return a2.slice();
		else return undefined;
	} else  if(a2 === undefined ){
		if(Array.isArray(a1)) return a1.slice();
		else return undefined;
	} else if(a1.length < a2.length) {
		return a2.map((v,i) => v+(a1[i]||0));
	} else return a1.map((v,i) => v+(a2[i]||0));
}

/**
 * THis decorates and array function so that it can have one of two forms
 * 1. arrayFunction(mappingFunction, array)
 * 2. arrayFunction(array)
 * 3. arrayFunction(mappingFunction) - return a new function that takes just an arra
 *
 * the originam
 * performs checks and currying for the functions below    
 * acts on a function of the form arrFunc(transFormFunction, arr)
 * @param  {Function} functionToDecorate [description]
 * @return {Function}        [description]
 */
function arrCurry(functionToDecorate) {
	return function (transformElement,arr) {
		if( isFunction(transformElement) ) {
			if( arr === undefined ) return (array) => functionToDecorate(transformElement, array);
			else if(isArray(arr)) return functionToDecorate(transformElement,arr);		
		}
		if( isArray(transformElement) ) {
			if( arr === undefined) {
				arr = transformElement;
				return functionToDecorate(ID,arr);
			}
		}
		throw new TypeError('Invalid argument, Please pass proper array argument');
	};
}

function ID(x) { return x; }

/**
 * [safeDedup description]
 * @param  {Array} list [description]
 * @return {Array}      [description]
 */
export function safeDedup(list) {
	let len = list.length;
	let res = [];
	for(let i=0; i<len; i++){
		let v = list[i];
		if(res.indexOf(v) === -1) res.push(v);
	}
	return res;
}

/**
 * [description]
 * @param  {Function} fn   [description]
 * @param  {Array}      arr) {	var        dict [description]
 * @return {Array}        [description]
 */
export const arrDedup = arrCurry(function(fn,arr) {
	var dict = new Map();
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		let e = arr[i];
		let v = fn(e);
		if (dict.get(v) === undefined) {
			dict.set(v, e);
			result.push(e);
		}
	}
	return result;
});


/**
 * [description]
 * @param  {Function} fn   [description]
 * @param  {[type]}   arr) {	if         (arr.length [description]
 * @return {[type]}        [description]
 */
export const arrSum = arrCurry(function(fn,arr) {
	if (arr.length === 0)
		return 0;
	var result = fn(arr[0]);
	for (var i = 1; i < arr.length; i++)
		result += fn(arr[i]);
	return result;
});

/**
 * [description]
 * @param  {Function} fn   [description]
 * @param  {[type]}   arr) {	var        min [description]
 * @return {[type]}        [description]
 */
export const arrMin = arrCurry(function(fn,arr) {
	var min = fn(arr[0]);
	for (var i = 0; i < arr.length; i++) {
		min = Math.min(min,fn(arr[i]));
	}
	return min;
});

/**
 * [description]
 * @param  {Function} fn   [description]
 * @param  {[type]}   arr) {	var        min [description]
 * @return {[type]}        [description]
 */
export const arrMax = arrCurry(function(fn,arr) {
	var min = fn(arr[0]);
	for (var i = 0; i < arr.length; i++) {
		min = Math.max(min,fn(arr[i]));
	}
	return min;
});

/**
 * [description]
 * @param  {[type]} testFn [description]
 * @param  {[type]} arr)   {		let       len [description]
 * @return {[type]}        [description]
 */
export const arrCount = arrCurry(
	function(testFn,arr) {
		let len = arr.length;
		let count = 0;
		for(let i=0; i<len; i++) {
			if(testFn(arr[i])) count++;
		}
		return count; //list.reduce((cnt,e) => (e || '').trim() == v ? cnt+1 : cnt, 0);
	});


/**
 * [description]
 * @param  {Function} fn   [description]
 * @param  {[type]}   arr) {	let        cnt [description]
 * @return {[type]}        [description]
 */
export const arrMean = arrCurry(function(fn,arr) {
	let cnt = 0, result = 0.0, len = arr.length;
	for (let i = 0; i < len; i++) {
		let v = fn(arr[i]);
		if( typeof v === 'number') {
			result += v;
			cnt++;
		}
	}
	return result*1.0/cnt;
});

/**
 * are two arrays equal
 * @param  {[type]} arr1 [description]
 * @param  {[type]} arr2 [description]
 * @return {[type]}      [description]
 */
export function arrEqual(arr1, arr2) {
	if (!isArray(arr1) || !isArray(arr2)) {
		throw new TypeError('Invalid argument, Please pass proper array argument');
	}

	if (arr1.length !== arr2.length)
		return false;
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i])
			return false;
	}
	return true;
}

/**
 * [arrDistinct description]
 * @param  {[type]} arr1 [description]
 * @param  {[type]} arr2 [description]
 * @return {[type]}      [description]
 */
export function arrDistinct(arr1, arr2) {
	return (!arrEqual(arr1, arr2));
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



/**
 * function to take the hash of an array of integers
 * @param {[int]} arrOfInt array of integers
 */
export function setHash(arrOfInt) {
	var hash = 5381,
		i    = arrOfInt.length ;
	if( i > 5 ) i=5;
	let j=i;
	while(i--) {
		hash = (hash * 33) ^ arrOfInt[j-i];
	}

	/* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
	 * integers. Since we want the results to be always positive, convert the
	 * signed int to an unsigned by doing an unsigned bitshift. */
	return hash >>> 0;    
}



export function zipToDict(aListOfPairs) {
	return aListOfPairs.reduce( (dict, [k,v]) => { 
		if(dict[k] !== undefined) throw new Error('duplicate key: '+k);
		dict[k] = v; 
		return dict;
	}, {});
}

export function dictToZipB(aDict) {
	return Object.keys(aDict).map( k => [k, aDict[k]]);
}
export function dictToZip(aDict) {
	return dictToZipB(aDict).sort( (a,b) => a[0] < b[0]);
}

/**
 * 
 * @param  {Function]}   arr [description]
 * @param  {Function} fn  [description]
 * @return {[type]}       [description]
 */
/**
 * filter an attar and return the index found
 * @param  {Function} fn  	testing function for the filter
 * @param  {[any]}   arr 	array of items to filter
 * @return {[integre]}      return an array of indexex
 */
export function filterIX(fn,arr) {
	let ln = arr.length;
	let res = newArray(ln,0);
	let j = 0;
	for (let i = 0; i < ln; i++) {
		if (fn(arr[i])) res[j++] = i;
	}
	res.length = j;
	return res;	
}


