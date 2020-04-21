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

const defaultStyle = `<style> 
	.ftable  { 
		font-family: arial, sans-serif; 
		color: blue !important; 
		border-collapse: collapse; 
		border-spacing: 0; 
		border: 1px solid #000; 
		font-size: 1rem;
	} 
	.ftable thead {
	   text-align: left; 
	   background-color: grey;
	   border: 1px solid #000; 
	} 
	.ftable tr { border: 1px solid #000000; text-align: left;  }
	.ftable th { 
		border: 1px solid #000000;  
		text-align: center; 
		color: red !important;
		background-color: grey;
	} 
	.ftable td { border: 1px solid #000000; text-align: left;  }
	.ftable tbody > tr:nth-child(even) { background-color: #44dddd !important; }
	.ftable tbody > tr:nth-child(odd) { background-color: white !important; }
</style>\n`;

export default function toHTML(aFrame, myStyle, rowColor=colorDefault) {
		let columns = aFrame.columns;
		if(myStyle === '*') myStyle = defaultStyle;
		myStyle = myStyle || '';
		return (
			myStyle +
			'<table class="ftable"><thead>' +
			'<tr><th>Ix</th>' + columns.map(c => '<th>' + c.replace(/_/g, ' ') + '</th>').join('') + '</tr></thead><tbody>' +
			aFrame.data.slice(0, Math.min(aFrame.length, (aFrame.showLen|| 200))).map(showRow).join('') +
			'</tbody></table>'
		);
		function showRow(r, i) {
			let rowColorV = rowColor(aFrame._rowObj(r),i); 
			let style = rowColorV ? 'style="background-color: ' + rowColorV + '"' : ''; 
			return ('<tr'+style+'><td>' + i + '</td>' + r.map(c => '<td>' + (ns(c)) + '</td>').join('') + '</tr>');
		}
		function ns(s) {
			if (typeof s !== 'string') return (s === undefined ? '' : '' + s) || '';
			if (s.indexOf('<') !== -1) s = s.replace(/</g, '&lt;');
			if (s.indexOf('>') !== -1) s = s.replace(/>/g, '&gt;');
			return (s === undefined ? '' : '' + s) === 'NON' ? 'NS' : s;
		}
}

function colorDefault(r,i) { return undefined; }