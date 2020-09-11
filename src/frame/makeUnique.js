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
 * [description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
export const arrayUniq = (list)  => Object.keys(_makeUnique(list)).sort();



const EMPTY_STR = '';
/**
 * @param  {[column_elements]} listOfRows 
 * @param  {[type]} colIx 	The column to make unique
 * @return {dict}   returns an object representing mapping of unique values where key and value are the same
 */
export function _makeUnique(listOfRows,colIx) {

	let dict = {};
	if( colIx === undefined) {
		let list = listOfRows; // the list just has data
		let len = list.length;
		for(let i = 0; i<len;i++) { 
			let row = list[i];
			let rlen = row.length;
			for(let k=0; k< rlen; k++){
				let x = row[k];
				if( typeof x === 'string' || x === undefined) {
					x = x===undefined ? EMPTY_STR :x;
					let nv = dict[x];
					if(nv === undefined) dict[v] = nv = x;
					row[k] = nv;
				}
			}
		} 
	}
	else {
		let len = listOfRows.length;
		let cnt = len<5000? len: Math.max(5000, Math.trunc(len/3));
		for(let i = 0; i<len;i++) {
			let row = listOfRows[i];
			let v = row[colIx];
			if( v === undefined || typeof v === 'string'  ) {
				if( !v ) {
					row[colIx] = EMPTY_STR;
				} else {
					let nv = dict[v];
					if(nv === undefined && cnt-- > 0) dict[v] = nv = v;
					else nv = v;
					row[colIx] = nv;
				}
			}
		} 
	}
	return dict;
}


