
/**
 * [cmpStr description]
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
export function cmpStr(a,b) {
	if( a === b ) return 0;
	return a<b? -1 : 1;
}
