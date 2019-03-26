//=====================================================
/**
 * Utilities for handling string buffers
 * 
 * Assumptions about string buffers
 * 
 *  1. Consists of multiple lines
 *  2. Each line consists og multiple columns
 *  3. Buffer is a stored in a single contigious string
 * 
 * given data encoding is a single contigious string.  
 * each line is seperated by '\n' (unix file format)
 * line split into columns, where the columns are seperated by 
 * the '\t' tab character.
 */



/**
 *
 *  given:
 *  @params (in)
 *     'data' - (string) representing the entire buffer
 *     lineStartPos - offset in data for a specific line
 *
 *  out:
 *      fields - array, offest position of all the 'field' 
 *               offsets in the line starting at lineStartPos
 *
 *  returns - int , the number of fields in that line
 *
 *
 *
 */


/**
 * [getColumnStarts description]
 * @param  {String} data         Big string buffer, line are seperated by '\n' columns are separated by '\t'
 * @param  {int32} lineStartPos	Offset in the data
 * @param  {[array of int32]}	fields       [description]
 * @return {int32}				number of columns on the line
 */
export function getColumnStarts(data, lineStartPos, fields) {
	const NL = '\n'.charCodeAt(0)|0;
	const TAB = '\t'.charCodeAt(0)|0;
	let ix = 1;
	let len = data.length|0; //console.log(len,line);
	fields[0] = lineStartPos|0;

	let c = TAB;
	for(let i = lineStartPos|0; i<len; i++) {
		if((c=data.charCodeAt(i)) === TAB || c == NL) {
			fields[ix++]=(i+1)|0;
			if(c === '\n') {
				return ix;
			}
		}
	}
	fields[ix++] = len+1;
	return ix;
}



// function getCol(line,fieldIx, i) {
//   return line.substring(fieldIx[i], fieldIx[i+1]-1);
// }


/**
 * [skipTab description]
 * @param  {String} data     Big string buffer, line are seperated by '\n' columns are separated by '\t'
 * @param  {int32} cpos      Offset in the data
 * @param  {int32} n    column number from cpos
 * @return {int32}      Offset of the column
 */
export function skipTab(data, cpos, n) {
	let end = cpos|0;
	let ln = data.length|0;
	const NL = '\n'.charCodeAt(0)|0;
	const TAB = '\t'.charCodeAt(0)|0;
	let c = TAB; 
	if(n > 0) {
		while(end < ln && n > 0 ){
			if((c=data.charCodeAt(end++)) ===NL) return end;
			if(c === TAB) n--;
		}
		if(end >= ln) end = ln;
	} else {
		if( end >= 1 && data.charCodeAt(end-1) === TAB) end -= 2;
		if( end < 0 ) return 0;
		while(end > 0  && n < 0 ){
			//console.log("n,end, ch",n,end,c);
			if((c=data.charCodeAt(end--)) ===NL) return end+1;
			if(c === TAB) n++;
		}
		if(end <= 0 ) end=0;
		else end +=  2;
	}
	return end;
}

/**
 * [getColStart description]
 * @param  {String} data     Big string buffer, line are seperated by '\n' columns are separated by '\t'
 * @param  {int32} cpos      Offset in the data
 * @return {number}      Offset of the column start position
 */
export function getColStart(data,cpos) {
	let start=cpos|0;

	let c=0;
	while( (c=data[start]) !== '\t' && c !== '\n' && start > 0 ) {
		start--;
	}
	return ( start > 0 )? start+1 : 0;
}

/**
 * [getColEnd description]
 * @param  {String} data     Big string buffer, line are seperated by '\n' columns are separated by '\t'
 * @param  {int32} cpos      Offset in the data
 * @return {number}      Offset of the column end position
 */
export function getColEnd(data,cpos) {
	let end = cpos;
	let ln = data.length;
	let c = '\t'; 
	while(end < ln && (c=data[end]) !=='\n'&& c !== '\t') end++;
	return end;
}

/**
 * [getColAt description]
 * @param  {String} data     Big string buffer, line are seperated by '\n' columns are separated by '\t'
 * @param  {int32} cpos      Offset in the data
 * @return {String}      Sting at the column selected
 */
export function getColAt(data,cpos){
	return data.substring(getColStart(data,cpos), getColEnd(data,cpos));
}
 
/**
	* [getColAtPlus description]
	* @param  {String} data      Big string buffer, line are seperated by '\n' columns are separated by '\t'
	* @param  {int32} cpos      Offset in the data
	* @param  {number} colOffset number of columns from cpos
	* @return {String}           string at the selected column
*/
export function getColAtPlus(data,cpos, colOffset){
	return getColAt(data,skipTab(data,cpos,colOffset));
}  

/**
 * Get the line contain cpos.
 * @param  {[type]} data [description]
 * @param  {[type]} cpos [description]
 * @return {[type]}      [description]
 */
// export function getLine(data, cpos) {
//     let start=cpos, end = cpos;
//     let ln = data.length;
//     let NL = '\n'.charCodeAt(0)|0;
//     while(end < ln && data.charCodeAt(end) !==NL) end++;
//     while( data.charCodeAt(start) !== NL && start > 0 ) start--;
//     if( start > 0) start++;
//     return data.substring(start, end);
// }

/** 
 * given a position with a line, get the start of line position
 * @param  {String} data Big string buffer, line are seperated by '\n' columns are separated by '\t'
 * @param  {number} cpos Pos in the data string
 * @param  {number} dx   1 = find the next line, -1 = find the begining of this line
 * @return {number}      Offset of the line withing the string
 */
export function getLineIx(data, cpos,dx) {
	let start=cpos;
	let ln = data.length;
	let NL = '\n'.charCodeAt(0)|0;
	dx = dx === undefined ? 1 : dx;
	if( dx > 0 ) {
		for( ;dx > 0 && start < ln; dx--){
			while(start < ln && data.charCodeAt(start) !== NL) start++;
		}
		if( start < ln) start++;
	}
	else if( dx < 0 ) {
		for( ;dx < 0 && start > 0 ; dx++) {
			while( data.charCodeAt(start) !== NL && start > 0 ) start--;
		}
		if( start > 0) start++;
	}
	
	return start;
}




