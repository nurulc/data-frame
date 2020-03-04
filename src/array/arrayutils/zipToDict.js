
/**
 * @param  {[type]}
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

