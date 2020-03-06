
import memoize from './memoize';
import pickRaw from './pickRaw'
/**
 * extract elements of an object, or from a list of elements
 * 	pick(key) => returns a function that takes an object and returns an elemnt 
 *  pick(keyList) => returns a function that takes an object and returns an array of element values
 *
 * @param  {String} list   String or array of strings
 * @return {function}      function that takes an object and returns the key or an array of keys
 */
export default  memoize(pickRaw);

