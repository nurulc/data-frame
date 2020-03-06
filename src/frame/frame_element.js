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

/**
 *
 *  Used as an internal capability of a Frame
 *. This is a class file generator for Frame row object ( this object can access the columns by column name)
 *  So if the aFrame has columns 'NAME', "ADDRESS"
 *
 *   let row = aFrame.asObj(0);
 *
 *    row.NAME === 'name column value'
 *    row.ADDRESS
 *
 *   The simple monded way of doing the is to create a dictionary like object, for row ix,  row = {} ;  row[column[i]] = data[ix][i]
 *    but this gives javascript JIT no opportunity to optimize,
 *
 * instead we dunamically create class definition with all the accessors as 'get' (computed attribute)
 * Thi module create such a class. This uses the full power of Javascript and the Javascript JIT, 
 * 
 *  	_rowObj(elem) {
 *		//console.log("**************** make raw ********************");
 *		return new this.AccessClass(elem);
 *		//return this._columns.reduce((obj, k, ix) => { obj[k] = elem[ix]; return obj; }, {});
 *	}
 *
 * 
 */

// function mapn(n,fn,arr) { 
// 	for(let i=0; i<n; i++) arr.push(fn(i));
// 	return arr;
// }

// let access = eval(`[${mapn(101,i => `function () { return this.__data[${i}]; }`,[]).join(',')}]`);


let access = [
	function () { return this.__data[0]; },
	function () { return this.__data[1]; },
	function () { return this.__data[2]; },
	function () { return this.__data[3]; },
	function () { return this.__data[4]; },
	function () { return this.__data[5]; },
	function () { return this.__data[6]; },
	function () { return this.__data[7]; },
	function () { return this.__data[8]; },
	function () { return this.__data[9]; },
	function () { return this.__data[10]; },
	function () { return this.__data[11]; },
	function () { return this.__data[12]; },
	function () { return this.__data[13]; },
	function () { return this.__data[14]; },
	function () { return this.__data[15]; },
	function () { return this.__data[16]; },
	function () { return this.__data[17]; },
	function () { return this.__data[18]; },
	function () { return this.__data[19]; },
	function () { return this.__data[20]; },
	function () { return this.__data[21]; },
	function () { return this.__data[22]; },
	function () { return this.__data[23]; },
	function () { return this.__data[24]; },
	function () { return this.__data[25]; },
	function () { return this.__data[26]; },
	function () { return this.__data[27]; },
	function () { return this.__data[28]; },
	function () { return this.__data[29]; },
	function () { return this.__data[30]; },
	function () { return this.__data[31]; },
	function () { return this.__data[32]; },
	function () { return this.__data[33]; },
	function () { return this.__data[34]; },
	function () { return this.__data[35]; },
	function () { return this.__data[36]; },
	function () { return this.__data[37]; },
	function () { return this.__data[38]; },
	function () { return this.__data[39]; },
	function () { return this.__data[40]; },
	function () { return this.__data[41]; },
	function () { return this.__data[42]; },
	function () { return this.__data[43]; },
	function () { return this.__data[44]; },
	function () { return this.__data[45]; },
	function () { return this.__data[46]; },
	function () { return this.__data[47]; },
	function () { return this.__data[48]; },
	function () { return this.__data[49]; },
	function () { return this.__data[50]; },
	function () { return this.__data[51]; },
	function () { return this.__data[52]; },
	function () { return this.__data[53]; },
	function () { return this.__data[54]; },
	function () { return this.__data[55]; },
	function () { return this.__data[56]; },
	function () { return this.__data[57]; },
	function () { return this.__data[58]; },
	function () { return this.__data[59]; },
	function () { return this.__data[60]; },
	function () { return this.__data[61]; },
	function () { return this.__data[62]; },
	function () { return this.__data[63]; },
	function () { return this.__data[64]; },
	function () { return this.__data[65]; },
	function () { return this.__data[66]; },
	function () { return this.__data[67]; },
	function () { return this.__data[68]; },
	function () { return this.__data[69]; },
	function () { return this.__data[70]; },
	function () { return this.__data[71]; },
	function () { return this.__data[72]; },
	function () { return this.__data[73]; },
	function () { return this.__data[74]; },
	function () { return this.__data[75]; },
	function () { return this.__data[76]; },
	function () { return this.__data[77]; },
	function () { return this.__data[78]; },
	function () { return this.__data[79]; },
	function () { return this.__data[80]; },
	function () { return this.__data[81]; },
	function () { return this.__data[82]; },
	function () { return this.__data[83]; },
	function () { return this.__data[84]; },
	function () { return this.__data[85]; },
	function () { return this.__data[86]; },
	function () { return this.__data[87]; },
	function () { return this.__data[88]; },
	function () { return this.__data[89]; },
	function () { return this.__data[90]; },
	function () { return this.__data[91]; },
	function () { return this.__data[92]; },
	function () { return this.__data[93]; },
	function () { return this.__data[94]; },
	function () { return this.__data[95]; },
	function () { return this.__data[96]; },
	function () { return this.__data[97]; },
	function () { return this.__data[98]; },
	function () { return this.__data[99]; },
	function () { return this.__data[100]; }
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


function getAccess(i) {
	if( access[i] ) return access[i];
	let fi =  function () { return this.__data[i]; };
	access[i] = fi;
	return fi;
}


let cache = {};

function maker() {
	return function(d) { this.__data = d; };
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

/**
 * [createAccesClass description]
 * @param  {[type]} columns [description]
 * @return {[type]}         [description]
 */
export function createAccesClass(columns) {
	let nx = columns.join('\t');
	let aClass;
	if( (aClass = cache[nx]) ) return aClass;
	let _constructor = maker();//function(d) { this.__data = d; console.log("Access Obj", columns)};
	aClass = cache[nx] = _MyCreateClass(
		_constructor,
		columns.map((key,ix) => ({key,  get: getAccess(ix), enumerable:true }))
	);
	aClass.prototype._toHtml = function() {
		return toHTML$(this,columns);
	};
	aClass.prototype.__columns___ = columns;
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