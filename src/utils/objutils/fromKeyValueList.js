
/**
 * [fromKeyValueList description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
export default function fromKeyValueList(list) {
	return list.reduce( (tab,[k,v]) => setKey(tab, k, v),{});
}

