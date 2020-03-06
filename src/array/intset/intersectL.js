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
 * Intersects two sorted array sets (array that issorted and has no duplicates)
 * @param  {[Array]} sortedA sorted array representing a set (no duplicated)
 * @param  {[Array]} sortedB sorted array representing a set (no duplicated)
 * @return {[Array]}         sorted array with no duplicates (a set)
 */
function _intersect2(sortedA, sortedB) {
	let res = [];
	let j=0;
	let lenA = sortedA.length;
	let lenB = sortedB.length;
	for(let i =0; i< lenA && j< lenB;i++) {
		let iA = sortedA[i];
		if(iA == sortedB[j]) {
			res.push(iA);
			j++;
		} else {
			while(j<lenB && iA > sortedB[j]) j++;
					
			if( j == lenB) return res;
			if(iA == sortedB[j]) {
				res.push(iA);
				j++;
			}
		}
	}
	return res;   
}

function _intersect3(sortedA, sortedB,sortedC) {
	let res = [];
	let j = 0;
	let k = 0;
	let lenA = sortedA.length;
	let lenB = sortedB.length;
	let lenC = sortedC.length;
	for(let i = 0; i< lenA && j< lenB&& k < lenC;i++) {
		let iA = sortedA[i];
		if(iA === sortedB[j] && iA === sortedC[k]) {
			res.push(iA);
			j++; k++;
		} else {
			while(j<lenB && iA > sortedB[j]) j++;  /* */     if( j === lenB) return res;          
			while(k<lenC && iA > sortedC[k]) k++;  /* */     if( k === lenC) return res;

			if(iA === sortedB[j] && iA === sortedC[k]) {
				res.push(iA);
				j++; k++;
			}
		}
	}
	return res;   
}


/**
 * intersection of an Array of sets, where each Set is represented as a sorted array of values (no dups)
 * @param  {[Array]} lsa Array of sets
 * @return {[Array]}     a Sorted array representing the intersection of all the sts
 */
export default  function intersectL(lsa) {
	if( !lsa || lsa.length == 0 || lsa.length == 1) return [];
	const lsaLen = lsa.length;
	if( lsaLen == 2 ) return _intersect2(lsa[0],lsa[1]);
	if( lsaLen == 3 ) return _intersect3(lsa[0],lsa[1],lsa[2]);
		
	// ix = array set and position elements, where each element [ pos-in-set, set-array]
	//let ix = lsa.map((ls) => [0,ls]);
	let ix = []; for(let i=0; i<lsaLen; i++) ix.push([0, lsa[i]]);
	//let sm = lsa.reduce( (s,l) => s.length > l.length? l : s, lsa[0]); // find shortest
		
	let sm = lsa[0]; // ugly but fast version of find the shortest set;
	for(let i=1; i<lsaLen; i++) 
		if(lsa[i].length<sm.length) sm = lsa[i]; // find tthe shortest set (sm = shortest set)
		
	let res = [];
	const smLen = sm.length;
	for(let i=0; i<smLen; i++) {
		let v = sm[i];
		//let ixLen = ix.length; 
		for(let j =0; j<lsaLen; j++) { //move all the set positions, so that elememt at 'pos'  >= sm[i]
			let [k, e] = ix[j];
			let eLen = e.length;
			while( k< eLen && e[k]< v) k++;
						
			ix[j][0] = k; // update pos in set
		}
		//let v1 = ix.reduce( (s,[j,z]) => s === z[j] ? s : undefined, v );
		//let ln = ix.length;
		// make sure all the 
		let v1 = v;
		for(let k=0; k<lsaLen; k++) {
			let [j,z] = ix[k];
			if(j < z.length && v1 !== z[j]) {
				v1 = undefined;
				break;
			}
		}
		if( v1 !== undefined ) res.push(v);

	}
	return res;
}


/*
[intersect([[0,1,2,3,5],[0,1,2,3,5,6],[0,1,2,4,5]]),
 intersect([[0,1],[0,1,2,3,5,6],[0,1,2,4,5]]),
 intersect([[0,1,2,3,5],[0,1,2,3,5,6],[4,5,7]]),
 intersect([[0,1,2,3,5,7],[0,3,5,6]])
]
*/

