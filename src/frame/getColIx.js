

export default function getColIx(aFrame, colName) {
	let ix = aFrame.colIx(colName);
	if( ix === -1 ) throw new Error(`column ${colName} not in frame: ${aFrame.name}`);
	return ix;
}