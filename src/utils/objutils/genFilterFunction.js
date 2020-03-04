
import {TRUE} from '../constants';
/**
 * create a function that tests for elements in aListOrStringOrEmpty
 *   aListOrStringOrEmpty => undefined - allows everything
 *   aListOrStringOrEmpty => [... names ] - allow only the elelemnts in the list 
 *   aListOrStringOrEmpty => <single string Name> (string) - allow only single name 
 * @param  {[type]}
 * @return {[type]}
 */
export default function genFilterFunction(aListOrStringOrEmpty) {
	if(aListOrStringOrEmpty === undefined) return TRUE;
	if(typeof aListOrStringOrEmpty === 'string') return (v => v === aListOrStringOrEmpty); // single name filter
	if(Array.isArray(aListOrStringOrEmpty)) return (v => aListOrStringOrEmpty.indexOf(v) !== -1); // matches a list
	throw new Error('Unexpected type - expected endefined, a string, or and array of string');
}

