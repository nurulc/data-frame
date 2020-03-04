
/**
 * [setKeyV description]
 * @param {[type]} obj [description]
 * @param {[type]} key [description]
 * @param {[type]} v   [description]
 */
export default function setKeyV(obj,key,v) {
	if(arguments.length == 1) 
		return obj[key];
	else if( v === undefined) return obj;
	else {
		let res = obj[key];
		if( res ) res.push(v);
		else obj[key] = [v];
		return obj;
	}
}

