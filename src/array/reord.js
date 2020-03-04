// Given a list (fulllist) [A,B,C,D,E,F]
// and a subset of the 'fulllist' but in a different order
// return a new version of the full list honoring the requested order

//===
function idx(list, scale) {
	return list.reduce((ret,v,i) => {ret[v] = (i+1)*scale; return ret;},{} );
}

function sIx(elem, mp, subIx, ret) {
	let pos = mp[elem];
	if( pos === undefined) {
		ret[elem]=subIx+1;
		return subIx+1;
	}
	ret[elem] = pos;
	return pos;
}
/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
export default function reord(subListWithNewOrder,fullList) {
	var mp = idx(subListWithNewOrder||[],fullList.length);
	//	console.log(mp);
	var ret = {};
	fullList.reduce((v,e) => sIx(e,mp,v, ret), 0 );
	
	var cmp = (a,b) => ret[a] - ret[b];
	return (list) => { var l = (list||fullList).slice(0); l.sort(cmp); return l;};

}
