
import EMPTY_KEY from './EMPTY_KEY';
import {EMPTY_ARRAY} from '../../utils/constants';
export default function getDict(dict, key, noEmpty) { /*local*/
	if(noEmpty && !key) return EMPTY_ARRAY;
	key = key || EMPTY_KEY;
	return dict[key] || EMPTY_ARRAY;
}

