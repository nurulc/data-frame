// some simple set manipulation that work of sets and arrays (where you can mix the two)

export function setRemove(as, rs) {
	let res = new Set();
	// O: KEEP
	as.forEach(v => {
		if(! rs.has(v) ) res.add(v);
	});
	return res;
} 

export function arrSetRemove(aa, rs) {
	let res = new Array(aa.length);
	let j = 0;
	aa.forEach(v => {
		if(! rs.has(v) ) res[j++] = v;
	});
	return res;
}

export function setIntersect(as,bs) {
	let res = new Set();
	// O: KEEP
	as.forEach(v => {
		if( bs.has(v) ) res.add(v);
	});
	return res;
}

export function setUnion(as,bs) {
	let res = new Set();
	// O: KEEP
	as.forEach(v =>  res.add(v));
	bs.forEach(v =>  res.add(v));
	return res;
}

export function setXor(as,bs) {
	let res = new Set();
	// O: KEEP
	as.forEach(v =>  {if(! bs.has(v) ) res.add(v);});
	bs.forEach(v =>  {if(! as.has(v) ) res.add(v);});
	return res;
}
