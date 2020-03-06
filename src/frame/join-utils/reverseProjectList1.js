/*local*/
export function reverseProjectList1(pL, col1, col2, f1Cols, f2Cols) {

	//console.log("PL0:", pL);
	let c = pL.map(s => s.split('='));
	//console.log("PL1:",  c);
	
	let len = c.length;
	for(let i=0; i<len; i++) {
		let col = c[i];
		if( col[0] === '2.'+col2 || col[0] === col2) col[0] = '1.'+col1;
		else  if( col[0] === col2) col[0] = '1.'+col1;
		else if( col[0].substr(0,2) === '2.' ) {
			if( f1Cols.indexOf(col[0].substr(2)) !== -1 ) col[0] = '1.'+col[0].substr(2);
		}
		else if(col[0].substr(0,2) === '1.') col[0] = col[0];
		else if( f1Cols.indexOf(col[0].substr(2)) !== -1 ) col[0] = '1.'+col[0];
	}
	return c.map( v => v.join('='));
}

export function reverseProjectList2(pL, col1, col2, f1Cols, f2Cols) {

	//console.log("PL0:", pL);
	let c = pL.map(s => s.split('='));
	//console.log("PL1:",  c);
	
	let len = c.length;
	for(let i=0; i<len; i++) {
		let col = c[i];
		if( col[0] === '1.'+col1 || col[0] === col1) col[0] = '2.'+col2;
		else  if( col[0] === col2) col[0] = '2.'+col2;
		else if( col[0].substr(0,2) === '1.' ) {
			if( f2Cols.indexOf(col[0].substr(2)) !== -1 ) col[0] = '2.'+col[0].substr(2);
		}
		else if(col[0].substr(0,2) === '2.') col[0] = col[0];
		else if( f2Cols.indexOf(col[0].substr(2)) !== -1 ) col[0] = '2.'+col[0];
	}
	return c.map( v => v.join('='));
}







