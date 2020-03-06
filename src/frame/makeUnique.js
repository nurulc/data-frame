/**
 * [description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
export const arrayUniq = (list)  => Object.keys(_makeUnique(list)).sort();



const EMPTY_STR = '';
/**
 * @param  {[[column_elements...]...]} listOfRows 
 * @param  {[type]} colIx 	The column to make unique
 * @return {dict}   returns an object representing mapping of unique values where key and value are the same
 */
function _makeUnique(listOfRows,colIx) {

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


