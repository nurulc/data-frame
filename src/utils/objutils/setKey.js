
/**
 * [setKey description]
 * @param {[type]} obj [description]
 * @param {[type]} key [description]
 * @param {[type]} v   [description]
 */
export default function setKey(obj,key,v) {
	if(arguments.length === 1) throw new Error("too few arguments");
	if(arguments.length === 2) 
		return obj[key];
	else {
		obj[key] = v;
		return obj;
	}
}

