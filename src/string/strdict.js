/**
 * Code taken from https://github.com/darkskyapp/string-hash, 
 * Too small to be worth is own module.
 * @param  {string} str	The string to hash (isf str is not a string make it into a string)
 * @param  {int32} start	start pos in the string
 * @param  {int32} end	The end position of thestring
 * @return {int32}		The hash value
 */
export function strHash(str,start,end) {
	if(str === undefined) return 5381;
	if(typeof str !== 'string') str = str.toString();
	var hashV = 5381|0,
		ln    = (end || str.length) | 0;
	var i = start || 0;
	if( ln - start > 7) ln = start+7;
	for(;i< ln;) {
		hashV = (hashV * 33) ^ str.charCodeAt(i++);
	}
	if( hashV === 0 ) hashV = 1;

	/* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
	 * integers. Since we want the results to be always positive, convert the
	 * signed int to an unsigned by doing an unsigned bitshift. */
	return hashV>>>0;
}




// function strEq(str, strStart, strEnd, otherStr) {
// 	if( strEnd - strStart !== otherStr.length) return false;
// 	for(let i=strStart, j=0; i<strEnd; i++, j++) if( str[i] !== otherStr[j]) return false;
// 	return true;
// }

export function strEq(str, strStart, strEnd, otherStr) {
	if( strEnd - strStart !== otherStr.length) return false;
	for(let i=strStart, j=0; i<strEnd; i++, j++) if( str[i] !== otherStr[j]) return false;
	return true;
}

/**
 * [EMPTY_STR description]
 * @type {String}
 */
const EMPTY_STR = '';

/**
 * String Dictionary implememtation that minimizes the garbage created
 * 
 */
class StrDict {
	/**
	 * [constructor description]
	 * @param  {[type]} maxLen [description]
	 * @return {[type]}        [description]
	 */
	constructor(maxLen) {
		let len = (maxLen || 1997)|0;
		this.dictI = new Array(len);  
		this.dictV = new Array(len);
		this.length = 0;
		for(let i=0; i<len; i++) {
			this.dictI[i] = 0;
			this.dictV[i] = EMPTY_STR;
		}
		
	}
/**
 * [get description]
 * @param  {String} str    [description]
 * @param  {int32} start  [description]
 * @param  {int32} end    [description]
 * @param  {string/opt} valStr If this is set the value is used to populate the hsh table
 * @return {[type]}        [description]
 */
	get(str, start, end, valStr) { // always return a string, if it is not in the dictionary then add it, valStr is only used during expand
		//throw new Error("not implementes");
		
		start = (start || 0) | 0;
		end = (end || str.length) | 0;
		if( start === end) return EMPTY_STR;
		let hx = strHash(str, start,end);
		let dictI = this.dictI, dictV = this.dictV;
		let len = dictI.length;
		let ix = hx % len;
		// while( dictI[ix] ) {
		//   if( dictI[ix] === hx && strEq(str,start,end, dictV[ix]) ) return dictV[ix];
		//   ix = (ix + 1) % len;
		// }
		let s,vx;
		let slen = end-start;
		while( vx = dictI[ix] ) {
			check: {
				if( vx === hx ) {
					let otherStr = dictV[ix];
					let ol = otherStr.length | 0;
					if( slen !== ol) { ix = (ix + 1) % len; continue }
					
					for(let i=start; i<end; i++) {
						if( str[i] !== otherStr[i-start]) break check;
					}
					//if( i === end ) 
					return dictV[ix];
				}
			}
			ix = (ix + 1) % len;
		}
		if( !vx ) {
			dictI[ix] = hx;
			dictV[ix] = valStr !== undefined ? valStr : str.substring(start,end);
			this.length++;
			let rStr = dictV[ix];
			if( this.length > len * 0.8 ) this.expand();
			return rStr;
		} 
		throw new Error("str: "+str.substring(start,end) + " not found");
	}

	getV(str) {
		if(!str) return str;
		let hx = strHash(str, 0,str.length);
		let dictI = this.dictI, dictV = this.dictV;
		let len = dictI.length;
		let ix = hx % len;
		let end = str.length;
		let s,vx;
		while( vx = dictI[ix] ) {
			if( vx === hx && str === dictV[ix] ) return dictV[ix];
			ix = (ix + 1) % len;
		}
		if( !vx ) {
			dictI[ix] = hx;
			dictV[ix] = str;
			this.length++;
			let rStr = dictV[ix];
			if( this.length > len * 0.8 ) this.expand();
			return rStr;
		} 
		throw new Error("str: "+str + " not found");
	}

/**
 * [expand description]
 * @return {[type]} [description]
 */
	expand() {
		let len = this.dictI.length;
		let dictV = this.dictV;
		let newDict = new StrDict(this.dictI.length*2+1);
		for(let i=0; i < len; i++) {
			let str = dictV[i];
			if(str) newDict.getV(str);
		} 
		this.dictI = newDict.dictI;
		this.dictV = newDict.dictV;
		this.length = newDict.length;
	}
/**
 * [values description]
 * @return {[type]} [description]
 */
	values() {
		return this.dictV.filter(x => x);
	}
}
