
import {isA} from './isA';
/**
 * @param  {object} aDict 
 * @param  {[type]} listOrFunc
 * @return {Object} Object action as a dictionary
 */
export default function filterDict(aDict, listOrFunc) {
	if( !listOrFunc ) return aDict;
	if( Array.isArray(listOrFunc)) {
		return listOrFunc.reduce((dict,v) => { if(aDict[v]) dict[v] = aDict[v]; return dict; }, new Map());
	} else if( isA.function(listOrFunc) ) {
		return listOrFunc(aDict).reduce((dict,v) => { if(aDict[v]) dict[v] = aDict[v]; return dict; }, new Map());
	}
	return aDict;
}

