

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
