// csv.js  
//import {csvLine,tsvLine,psvLine} from './csv';


var _escape_ = '\x0B\0B';
var _mat_escape_ = new RegExp(_escape_,'g');
function __rep(s) {
	//if(s==',') return '.';
	if(s[0] == '"' && s[s.length-1] == '"') {
		var z = s.substr(1,s.length-2);
		//console.log(z)
		return z.replace(/""/,'"').replace(/,/g,_escape_);
	}
	return '???';
}

export function csvLine(line) {
	const re = /"([^"]|"")*"/g;
	return trimListElements(line.replace(re,__rep).replace(/,/g, '\x01').replace(_mat_escape_,',').split('\x01'));
	//return line.replace(re,__rep).replace(/,/g, "\x01").replace(_mat_escape_,",").split('\x01').map(x=>x.trim());
}

// modifies the input array
function trimListElements(arr) {
	let len = arr.length;
	for(let i=0; i<len; i++) {
		let s = arr[i];
		if( s === '' || s === undefined) s = '';
		else s = s.trim();
		arr[i] = s;
	}
	return arr;
}

export function tsvLine(line) {
	return trimListElements(line.split('\t'));
	//return line.split('\t').map(x=>x.trim()); // nicer code, but much slower
}

export function psvLine(line) {
	return trimListElements(line.split('|'));
	//return line.split('|').map(x=>x.trim()); // nicer code but much slower
}

export function dataSplit(data,splitter,fn) {
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



