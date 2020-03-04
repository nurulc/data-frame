
import {cmpStr} from './cmpStr';
import {toNumber} from './toNumber';
const  isString = (s) =>  (typeof s) === 'string';
const  isNum = (a) =>  (typeof a) === 'number' && a !== Infinity;//isNum = (a) =>  (typeof a) === 'number';
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
