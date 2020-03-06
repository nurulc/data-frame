
import prefixLen from './prefixLen';
/**
 * gets the prefix string of 'a' and 'n', for example a = 'asset', b = 'assess', the return will be 'asse'
 * @param  {string} a first string
 * @param  {string} b second
 * @return {string}   the common prefix of both a and b
 */
export default  function prefixHead(a,b) {
	return a.substr(0,prefixLen(a,b));
}

