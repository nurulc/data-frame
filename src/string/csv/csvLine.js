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

