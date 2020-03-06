
import setKeyV from './setKeyV';
/**
 * [fromKeyValueListV description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
export default function fromKeyValueListV(list) {
	return list.reduce( (tab,[k,v]) => setKeyV(tab, k, v),{});
}


