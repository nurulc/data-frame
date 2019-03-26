/**
 *
 *. This is a class file generator for DataFrame row object ( this object can access the columns by column name)
 *  So if the a DataFrame, frame, has columns 'NAME', "ADDRESS"
 *
 *   let row = frame.asObj(0);
 *
 *    row.NAME === 'name column value'
 *    row.ADDRESS
 *
 *   The simple minded way of doing the is to create a dictionary like object, for row ix,  row = {} ;  row[column[i]] = data[ix][i]
 *    but this gives javascript JIT no opportunity to optimize,
 *
 * instead we dynamically create class definition with all the accessors as 'get' (computed attribute)
 * Thi module create such a class. This uses the full power of Javascript and the Javascript JIT, 
 * 
 *  	_rowObj(elem) {
 *		//console.log("**************** make row ********************");
 *		return new this.AccessClass(elem);
 *		//return this._columns.reduce((obj, k, ix) => { obj[k] = elem[ix]; return obj; }, {});
 *	}
 *
 * 
 */





let access = [
	function () { return this.__get(0); },
	function () { return this.__get(1); },
	function () { return this.__get(2); },
	function () { return this.__get(3); },
	function () { return this.__get(4); },
	function () { return this.__get(5); },
	function () { return this.__get(6); },
	function () { return this.__get(7); },
	function () { return this.__get(8); },
	function () { return this.__get(9); },
	function () { return this.__get(10); },
	function () { return this.__get(11); },
	function () { return this.__get(12); },
	function () { return this.__get(13); },
	function () { return this.__get(14); },
	function () { return this.__get(15); },
	function () { return this.__get(16); },
	function () { return this.__get(17); },
	function () { return this.__get(18); },
	function () { return this.__get(19); },
	function () { return this.__get(20); },
	function () { return this.__get(21); },
	function () { return this.__get(22); },
	function () { return this.__get(23); },
	function () { return this.__get(24); },
	function () { return this.__get(25); },
	function () { return this.__get(26); },
	function () { return this.__get(27); },
	function () { return this.__get(28); },
	function () { return this.__get(29); },
	function () { return this.__get(30); },
	function () { return this.__get(31); },
	function () { return this.__get(32); },
	function () { return this.__get(33); },
	function () { return this.__get(34); },
	function () { return this.__get(35); },
	function () { return this.__get(36); },
	function () { return this.__get(37); },
	function () { return this.__get(38); },
	function () { return this.__get(39); },
	function () { return this.__get(40); },
	function () { return this.__get(41); },
	function () { return this.__get(42); },
	function () { return this.__get(43); },
	function () { return this.__get(44); },
	function () { return this.__get(45); },
	function () { return this.__get(46); },
	function () { return this.__get(47); },
	function () { return this.__get(48); },
	function () { return this.__get(49); },
	function () { return this.__get(50); },
	function () { return this.__get(51); },
	function () { return this.__get(52); },
	function () { return this.__get(53); },
	function () { return this.__get(54); },
	function () { return this.__get(55); },
	function () { return this.__get(56); },
	function () { return this.__get(57); },
	function () { return this.__get(58); },
	function () { return this.__get(59); },
	function () { return this.__get(60); },
	function () { return this.__get(61); },
	function () { return this.__get(62); },
	function () { return this.__get(63); },
	function () { return this.__get(64); },
	function () { return this.__get(65); },
	function () { return this.__get(66); },
	function () { return this.__get(67); },
	function () { return this.__get(68); },
	function () { return this.__get(69); },
	function () { return this.__get(70); },
	function () { return this.__get(71); },
	function () { return this.__get(72); },
	function () { return this.__get(73); },
	function () { return this.__get(74); },
	function () { return this.__get(75); },
	function () { return this.__get(76); },
	function () { return this.__get(77); },
	function () { return this.__get(78); },
	function () { return this.__get(79); },
	function () { return this.__get(80); },
	function () { return this.__get(81); },
	function () { return this.__get(82); },
	function () { return this.__get(83); },
	function () { return this.__get(84); },
	function () { return this.__get(85); },
	function () { return this.__get(86); },
	function () { return this.__get(87); },
	function () { return this.__get(88); },
	function () { return this.__get(89); },
	function () { return this.__get(90); },
	function () { return this.__get(91); },
	function () { return this.__get(92); },
	function () { return this.__get(93); },
	function () { return this.__get(94); },
	function () { return this.__get(95); },
	function () { return this.__get(96); },
	function () { return this.__get(97); },
	function () { return this.__get(98); },
	function () { return this.__get(99); }
];


let _MyCreateClass = (function () { 
	function defineProperties(target, props) { 
		if( !props ) return target;
		props.forEach( descriptor => {
			descriptor.enumerable = descriptor.enumerable || false; 
			descriptor.configurable = true; 
			if ('value' in descriptor) { 
				descriptor.writable = true; 
			} 
			Object.defineProperty(target, descriptor.key, descriptor); 
		});
		return target;
	} 
	return function (Constructor, protoProps, staticProps) { 
		defineProperties(Constructor.prototype, protoProps);
		return defineProperties(Constructor, staticProps); 
	}; 
})();

/**
 *. Get the i-th columns in a row stored as tab separated string
 *. "to be\tor not\tto be\tthat" => to be | or not  | to be
 *
 *  If it has extracted a column it stores it in a cache so the next 
 *  time it can be efficiently accessed
 * @param  {[type]} i [description]
 * @return {[type]}   [description]
 */
function  get(i) {
	let v = this[i];
	if(v !== undefined) { 
		return v;
	}
	let data = this.__data;
	let len = data.length;
	let k = 0;

	
	let start = 0;
	for(let j=this.__offset; j<len; j++) {
		if(i === k) {
			let end = start = j;
			while(end < len) {
				let c = data[end++];
				if(c === '\t' || c === '\n') {
					v = data.substring(start,end-1);
					return this[i] = v;
				}
			}
			v = data.substring(start);
			return this[i] = v;
		} else {
			let c = data[j];
			if(c === '\t')  k++;
			else if( c === '\n') return '';     
		}
	}
	return '';
}


// function  __get(i) {
// 	let v;
// 	if(this.__cache) { 
// 		v = this.__cache[i];
// 		if( v ) return v;
// 	}
// 	let data = this.__data;
// 	let len = data.length;
// 	let k = 0;
// 	if( this.__cache === undefined) {
// 		this.__cache = [];
// 	}
	
// 	let start = 0;
// 	for(let j=this.__offset; j<len; j++) {
// 		if(i === k) {
// 			let end = start = j;
// 			while(end < len) {
// 				let c = data[end++];
// 				if(c === '\t' || c === '\n') {
// 					v = data.substring(start,end-1);
// 					return this.__cache[i] = v;
// 				}
// 			}
// 			v = data.substring(start);
// 			return this.__cache[i] = v;
// 		} else {
// 			let c = data[j];
// 			if(c === '\t')  k++;
// 			else if( c === '\n') return '';     
// 		}
// 	}
// 	return '';
// }

function getAccess(i) {
	if( access[i] ) return access[i];
	let fi =  function () { return this.__get(i); };
	access[i] = fi;
	return fi;
}


let cache = {};

function makerConstructor() {
	return function(d,offset) { 
		this.__data = d;
		//this.__cache__ = undefined; 
		if(offset !== undefined) this.__offset = offset|0;
	};
}

function htmlEncode(s) {
	if(typeof s !== 'string') return htmlEncode(''+s) || '';
	if( s.indexOf('<') !== -1 ) s = s.replace(/</g,'&lt;');
	if( s.indexOf('>') !== -1 ) s = s.replace(/>/g,'&gt;');
	return s;
}

function toHTML$(self,columns) {
	let list = columns.map(c => `<tr><td style="background-color: lightgrey">${htmlEncode(c)}</td><td>${htmlEncode(self[c])}</td></tr>`);
	return (`<table>${list.join('')}</table>`);
}

export function createAccesClass(columns) {
	let nx = columns.join('\t');
	let aClass;
	if( (aClass = cache[nx]) ) return aClass;
	let _constructor = makerConstructor();//function(d) { this.__data = d; console.log("Access Obj", columns)};
	aClass = cache[nx] = _MyCreateClass(
		_constructor,
		columns.map((key,ix) => ({key,  get: getAccess(ix), enumerable:true }))
	);
	aClass.prototype._toHtml = function() {
		return toHTML$(this,columns);
	};
	aClass.prototype.__columns___ = columns;
	aClass.prototype.__get = get;
	aClass.prototype.__offset = 0;
	aClass.toString = function() {
		if(this.__offset === 0 && this.__data.indexOf('\n') === -1 ) return this._data;
		else {
			let end = this.__data.indexOf('\n', this.__offset);
			if( end === -1) end = this.__data.length;
			return this.__data.substring(this.__offset, end);
		}
	};
	return aClass;
}

/*
	aClass = cache[nx] = _MyCreateClass(_constructor,
		[
			...columns.map((key,ix) => ({key,  get: getAccess(ix), enumerable:true })),
			{key: '__columns__', get: columns.slice(0), enumerable:true}
		]
	);
*/