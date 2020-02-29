import {flatten} from './flatten';

/**
 * array cross product in n dimension, where n ils the number of arguments (length of list)
 * Note: this can produce enormous amounts of data for n > 1, for esample n = 2, list[0].length = x ,and list[1].length = y
 * the resultant array contains x*y values, x = 100, y=200 we produce 20,000 values;
 *
 * for diremsion n=3, z = 50
 * 
 * @param  {...[type]} list [description]
 * @return {[type]}         [description]
 */
export default function arrProd(...list) { 
	if(list.length === 0) return [];
	if(list.length === 1) return [list[0]];
	let len = list.length;
	let row = [];
	for(let i=0; i<len; i++) row.push('');
	return xprod(list,0, row, []);
}


function xprod(list,ix, row, res) {
	if(ix >= list.length) {
		res.push(row.slice());
		return res;
	}
	else {
		let ls = list[ix];
		if( !Array.isArray(ls)) {
			row[ix] = ls || '';
			xprod(list,ix+1, row, res);
		} else {
			ls.forEach(v=> {
				row[ix] = v;
				xprod(list,ix+1, row, res);
			});
		}
		return res;
	}
}

