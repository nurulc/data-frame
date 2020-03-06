
import memoize from './memoize';
// Builds an accessor function for obj element key
// akey = access('akey);  then akey(obj) same as obj.akey,   
//                      akey(obj,value) same as obj.akey = value, ,
//                      but returns the obj and not the value you assigned 

/**
 * [description]
 * @param  {[type]} key) {		return    function(obj,v) {			if(arguments.length [description]
 * @return {[type]}      [description]
 */
export default  memoize(
	function (key) {
		return function(obj,v) {
			if(arguments.length == 1) return obj[key];
			else {
				obj[key] = v;
				return obj;
			}
		};  
	}
);

