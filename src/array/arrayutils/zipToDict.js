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

/**
 * @param  {[[string, any]]} aListOfPairs list of key value pairs
 * @return {[type]}
 */
export function zipToDict(aListOfPairs) {
	return aListOfPairs.reduce( (dict, [k,v]) => { 
		if(dict[k] !== undefined) throw new Error('duplicate key: '+k);
		dict[k] = v; 
		return dict;
	}, {});
}

export function dictToZipB(aDict) {
	return Object.keys(aDict).map( k => [k, aDict[k]]);
}
export function dictToZip(aDict) {
	return dictToZipB(aDict).sort( (a,b) => a[0] < b[0]?-1:1);
}

