
export const isA = {
	array: function isArray(arr) {
		if( !arr) return null;
		if(Array.isArray(arr)) return true;
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

