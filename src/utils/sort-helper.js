/**
 * 
 */

 

const  isString = (s) =>  (typeof s) === 'string';
const  isNum = (a) =>  (typeof a) === 'number' && a !== Infinity;//isNum = (a) =>  (typeof a) === 'number';
export function toNumber(str) {
	if(!str) return undefined;
	let len = str.length,negate = 1;
	let res = +str;
	if(!isNaN(res)) return res;
	if( res === Infinity ) return undefined;
	res = 0;
	if( str.length > 1 && (str[0] === '$'|| (str[0] ==='-' && str[1] === '$')) ) {
		let i = 1;
		if(str[1] === '-' || str[0] === '-'){
			negate = -1;
			i++;
		} 
		if( i === len ) return undefined;
		while(i<len) {
			let c = str[i];
            
			if( c === ',') { i++; continue; }
			if( c === '.') {
				let fraction = Number(str.substr(i));
				if( !isNaN(fraction)) {
					return 1.0*negate*res+fraction;
				}
				return undefined;
			}
			if(c < '0' || c > '9') return undefined;
			res = res*10+(+c);
			i++;
		}
		return res;
	} else {
		let i = 0;
		if(str[0] === -1){
			negate = -1;
			i++;
		} 
		if( i === len ) return undefined;
		while(i<len) {
			let c = str[i];
			if( c === ',') { i++; continue; }
			if( c === '.') {
				let fraction = Number(str.substr(i+1));
				if( !isNaN(fraction)) {
					return 1.0*negate*res+fraction;
				}
				return undefined;
			}
			if(c < '0' || c > '9') return undefined;
			res = res*10+(+c);
			i++;
		}
		return res;
	}
}

/**
 * [cmpStr description]
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
export function cmpStr(a,b) {
	if( a === b ) return 0;
	return a<b? -1 : 1;
}

/**
 * [cmpStrNum compare (number, number), or (number, string-of-number) or (string-of-number, number) (string-of-number, string-of-number) , (string, string) 
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
export function cmpStrNum(a,b) {
	if( isNum(a) ) {
		if( isNum(b) ) {
			return a-b;
		}
		if( isString(b) ) {
			let nb = toNumber(b);
			if( nb !== undefined ) {
				let r =  a - nb;
				if(r == 0 || isNaN(r)) return cmpStr(''+a, b);
				return r;
			}
			return cmpStr(''+a, b);
		}
	}
	else if( isNum(b) ) {
		if( isNum(b) ) return a-b;
		if( isString(b) ) {
			let na = toNumber(a);
			if( na !== undefined && na !== Infinity) {
				let r = na - b;
				if(r == 0 || isNaN(r) || r === Infinity) return cmpStr(a, ''+b);
				return r;
			}
			return cmpStr(a, ''+b);
		}	
	}
	let na = toNumber(a), nb= toNumber(b);
	//if( !isNaN(a1) && !isNaN(b1) ) return a1 - b1;
	if( na!== undefined && nb !== undefined && na !== Infinity && nb !== Infinity) {
		let r =  na - nb;
		if(r != 0 || !isNaN(r) || r !== Infinity) return r;
	}
	return cmpStr(a,b);
}

/**
 * comapre string or number (used to sort frames)
 * @param  {[type]} colIX column index
 * @return {function}        (row1, row2) => compares row1[columnIX] to row2[columnIX]
 */
export const cmpNumOrStrBy = (colIX) => (row1,row2) => (cmpStrNum(row1[colIX],row2[colIX]));

/**
 * [description]
 * @param  {function} cmp sort comparison function
 * @return {function}      new function what will do a reverse sort
 */
export const revCmp = (cmp) => (a,b) => cmp(b,a);




// 
/**
 * combine a set of sorting comparison functions
 * @param  {...[type]} funcs [description]
 * @return {[type]}          [description]
 */
export function combineCmp(...funcs) {
	let len = funcs.length;
	//funcs.find(f => (res=f(a,b))!==0); // clean but not so fast, below is fater
	switch(len){
	case 0: return () => 0;
	case 1: return funcs[0];
	case 2: return ((a,b) => funcs[0](a,b) || funcs[1](a,b));
	case 3: return ((a,b) => funcs[0](a,b) || funcs[1](a,b) || funcs[2](a,b));				
	default: 
	{
		return (
			(a,b) => 
			{
				for(let i=0; i<len; i++) {
					let res = funcs[i](a,b);
					if( res !== 0) return res;
				}
				return 0;
			});
	}
	}	
}
