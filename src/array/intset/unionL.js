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
 * Union of a list of sets: assumes both sets are are represented by sorted array, and as per set definition there are no dups 
 * @param  {[Array]} lsa : array[ array{set}... ] - array{set} of sorted elements (ascending order) and no duplicated
 * @return {[set]} a new set, where result = lsa[0] ∪ lsa[1] ∪ ...
 */
export default function unionL(lsa /* array of sets */) {
	//let mx = lsa.map(l => l.length);

	if(lsa.length === 0) return [];
	if( lsa.length == 1 ) return lsa[0];
	if( lsa.length == 2 ) return _union2(lsa[0],lsa[1]);
	if( lsa.length == 3 ) return _union3(lsa[0],lsa[1],lsa[2]);
	if( lsa.length == 4 ) return _union2(_union2(lsa[0],lsa[1]),_union2(lsa[2], lsa[3]));
	if( lsa.length == 5 ) return _union3(_union2(lsa[0],lsa[1]),_union2(lsa[2], lsa[3]),lsa[4]);
	if( lsa.length == 6 ) return _union3(_union2(lsa[0],lsa[1]),_union2(lsa[2], lsa[3]),_union2(lsa[4],lsa[5]));
		
	let [first,second] = arrSplit2(lsa);
	return _union2(unionL(first), unionL(second));
}

// union of two sets
function _union2(sortedA, sortedB) {
	let lenA = sortedA.length;
	let lenB = sortedB.length;
	if( lenA === 0 ) return sortedB;
	if( lenB === 0 ) return sortedA;
		
	if( lenA === 1 && lenB === 1) {
		if(sortedA[0] === sortedB[0]) return sortedA;
	}
	else if( lenA === 1 ) return _union2(sortedB, sortedA);
	else if( lenB === 1 ) {
		let b0 = sortedB[0];
		let a0 = sortedA[0];
		if(lenA === 1 ) {
			if(a0 === b0) return sortedA;
		} else {
			if( b0 === a0 ) return sortedA;
			if( b0 === sortedA[lenA-1]) return sortedA;
		}
	}
	let res = [];
	let j=0, i=0;
	//let iA = sortedA[0];
	for(; i< lenA && j< lenB; i++) {
		let iA = sortedA[i] | 0;
		do {
			let jB = sortedB[j] | 0; 
			//console.log(iA,jB);
			if(iA > jB) {
				res.push(jB);
				j++;
				if( j >= lenB) {
					res.push(iA);
					break;
				}
			} else if( iA === jB ){
				res.push(iA); 
				j++;
				break;
			} else {
				res.push(iA);
				break;
			}
		} while( j < lenB );
	}
	while(j<lenB) res.push(sortedB[j++]);
	while(i<lenA) res.push(sortedA[i++]);
	return res;   
}



function _union3(a,b,c) {
	return _union2(_union2(a,b),c);
}


/**
 * Split an array into an array of arrays each with equal parts, expect possibly for the last element
 * @param  {[type]}
 * @return {[type]}
 */
function arrSplit2(list) {
	let len = list.length;
	let half = len >>> 1;
	return [list.slice(0,half), list.slice(len-half)];
}



