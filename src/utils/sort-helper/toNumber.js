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
 * Convert a string to a Javascript number, thakes into accont number string with commas (,) and numbers
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export function toNumber(str) {
	if(str === '' || str === undefined) return undefined;
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
