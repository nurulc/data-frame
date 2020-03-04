
export default function dataSplit(data,splitter,fn) {
	let len = data.length;
	let res = [];
	res.length = len;
	if( splitter === undefined) splitter = psvLine;
	if( fn === undefined) {
		for(let i=0; i<len; i++) {
			res[i] = splitter(data[i]);
		}
	}
	else {
		for(let i=0; i<len; i++) {
			res[i] = splitter(fn(data[i],i));
		}
	}
	return res;
}



