export default function toHTML(aFrame, rowColor=colorDefault) {
		let columns = aFrame.columns;
		let TX = columns.indexOf('RULE_TYPE');
		
		return (
			//`<style> table.ftable {border-collapse: collapse; border-spacing: 0;  border: 2px solid #CCC; } \n</style>\n`+
			`<style> 
				.ftable  { font-family: arial, sans-serif; color: blue !important; } 
				td, th, tr { border: 1px solid #000000; text-align: left; } 
				th {color: red !important}
				tr:nth-child(even) { background-color: #dddddd; } }
			</style>\n`+
			'<p>Length: ' + aFrame.length + '</p>' +
			'<table class="ftable" style="border-collapse: collapse; border-spacing: 0;  border: 2px solid #000; font-size: 1rem"><thead style="background-color: lightgrey">' +
			'<tr style="border: 2px solid #000"><th style="border: 2px solid #000; color: blue">Ix</th>' + columns.map(c => '<th style="border: 2px solid #000; color: blue">' + c.replace(/_/g, ' ') + '</th>').join('') + '</tr></thead><tbody>' +
			aFrame.data.slice(0, Math.min(aFrame.length, aFrame.showLen)).map(showRow).join('') +
			'</tbody></table>'
		);
		function showRow(r, i) {
			let rowColorV = rowColor(aFrame._rowObj(r),i);
			return ('<tr style="background-color: ' + rowColorV + '"><td style="border: 2px solid #000">' + i + '</td>' + r.map(c => '<td style="border: 2px solid #000">' + (ns(c)) + '</td>').join('') + '</tr>');
		}
		function ns(s) {
			if (typeof s !== 'string') return (s === undefined ? '' : '' + s) || '';
			if (s.indexOf('<') !== -1) s = s.replace(/</g, '&lt;');
			if (s.indexOf('>') !== -1) s = s.replace(/>/g, '&gt;');
			return (s === undefined ? '' : '' + s) === 'NON' ? 'NS' : s;
		}
}

function colorDefault(r,i) {
	switch(r.RULE_TYPE) {
	case 'TRIGGER': return (i & 1) ?'#b0ffb0':'lightgreen';
	case 'ENABLER': return 'skyblue';
	case 'POTENTIAL_INCLUSION': return (i & 1) ? '#fbd3da' :'#ffcdd5';
	}
	return (i & 1) ? 'white' :'#fffaff';		
}