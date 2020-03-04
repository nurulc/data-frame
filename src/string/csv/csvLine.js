
import trimListElements from './trimListElements';
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

export default function csvLine(line) {
	const re = /"([^"]|"")*"/g;
	return trimListElements(line.replace(re,__rep).replace(/,/g, '\x01').replace(_mat_escape_,',').split('\x01'));
	//return line.replace(re,__rep).replace(/,/g, "\x01").replace(_mat_escape_,",").split('\x01').map(x=>x.trim());
}

