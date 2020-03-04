
import EMPTY_KEY from './EMPTY_KEY';
export default function localGroupBy(data,ix,noNull=false,dict={}) {
	data.forEach(r => addDict(dict, r[ix],r,noNull));
	return dict;
}


function addDict(dict, key, val,noEmpty) {
	if( noEmpty && !key) return dict;
	key = key || EMPTY_KEY;
	let list = dict[key];
	if( !list ) {
		dict[key] = [val];
	} else {
		if(val !== undefined)
			list.push(val);
	}
	return dict;
}

