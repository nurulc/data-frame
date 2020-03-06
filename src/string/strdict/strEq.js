
export default function strEq(str, strStart, strEnd, otherStr) {
	if( strEnd - strStart !== otherStr.length) return false;
	for(let i=strStart, j=0; i<strEnd; i++, j++) if( str[i] !== otherStr[j]) return false;
	return true;
}


