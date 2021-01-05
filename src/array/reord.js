// Given a list (fulllist) [A,B,C,D,E,F]
// and a subset of the 'fulllist' but in a different order
// return a new version of the full list honoring the requested order

//===
function idx(list, scale) {
	let initial = {};
	if(list[0] === '' && list.length > 1) { // an empty element at the begining indicates that the first elements must be at the begining
		initial[list[1]] = -1;
		list = list.slice(2);
	}
	return list.reduce((ret,v,i) => {ret[v] = (i+1)*scale; return ret;},initial );
}

function sIx(elem, mp, subIx, ret) {
	let pos = mp[elem];
	if( pos === undefined) {
		ret[elem]=subIx+1;
		return subIx+1;
	}
	ret[elem] = pos;
	return Math.max(pos,subIx+1);
}
/**
 *  Returns a function that will reorder an input array to a traget array format. The output array contains all the items in the input
 *  array but reordered (permutation). 
 *
 *  To create the reordering function, the simplest way to do this  is to give explicitly the new order. This is easy if the number of columns
 *  is small or  the new order is random permuation of the original. 
 *  Given a list defining the input order (original) [A,B,C,D,E,F], and a subset of the 'original' but in a different order, the sublist
 *  represents a partial or relative ordering relationship for the reordered elements
 *  return a function reorder data  honoring the requested order, the strategy is to mi
 *
 * Example of usage
 *  var original = ['a','b','c', 'd', 'e'];
 *  
 *    * 'e' before 'a'
 *  reord(['e','a'], original)(original); // place 'e' before 'a' (at the begining) => [ 'e', 'a', 'b', 'c', 'd' ]
 *  reord(['','e'], original)(original);  // place 'e' at the begining, shorthand for the above ('' represents a pseudo column before all other columns)
 *  reord(['e'], original)(original);     // does nothing, since no ordering is defined => ['a','b','c', 'd', 'e']
 *  reord(['d','e','b'], original)(original); // 'e' brfore 'b' and 'd' before 'e' => [ 'a', 'd', 'e', 'b', 'c' ]
 *  reord(['','d','e','c'], original)(original); // 'd' at begining and 'c' after 'e' => [ 'd', 'a', 'b', 'e', 'c' ]
 *  reord(['','e','d','b'], original)(original);// 'e' at begining 'd' before 'b' => [ 'e', 'a', 'd', 'b', 'c' ]
 *  reord(['','e','c','b','d'], original)(original);// 'e' at begining 'c' and 'b' before 'd' before 'b' [ 'e', 'a', 'c', 'b', 'd' ]
 *  reord(['','e','c','b',''], original)(original);// same as above '' indicates => [ 'e', 'a', 'c', 'b', 'd' ]
 *  reord(['e','c','b',''], original)(original);//[ 'a', 'e', 'c', 'b', 'd' ]
 *  reord(['e','a'],original)(original)
 *
 * 
 * @param  {string[]} subListWithNewOrder
 * @param  {string[]} fullList
 * @return {string[]} function to reordered an 
 */
export default function reord(subListWithNewOrder,fullList) {
	var mp = idx(subListWithNewOrder||[],fullList.length);
	//	console.log(mp);
	var ret = {};
	fullList.reduce((v,e) => sIx(e,mp,v, ret), 0 );
	
	var cmp = (a,b) => ret[a] - ret[b];
	return (list) => { var l = (list||fullList).slice(0); l.sort(cmp); return l;};

}
