
import {prefixLen} from './prefixLen';
/**
 * Gets the non-prefix string of 'a' and 'n', for example a = 'asset', b = 'assess', the return will be ['t', 'ss']
 * @param  {String} a [description]
 * @param  {String} b [description]
 * @return {[string]}   the non-common parts of  a and b, the part after the common prefix
 */
export default  function prefixTail(a,b) {
	let pre = prefixLen(a,b);
	return [a,b].map(x => x.substr(pre));
}
