
import haveFrame from '../../frame/haveFrame';
import getColIx from './getColIx';
import {MultiDict} from './MultiDict'
import {Frame} from './frame';

/**
 * [groupToDict description]
 * @param  {[type]} aFrame  [description]
 * @param  {[type]} colName [description]
 * @param  {[type]} cmp     [description]
 * @param  {[type]} mapFn   [description]
 * @return {[type]}         [description]
 */
export default function groupToDict(aFrame, colName, cmp,mapFn) {
	aFrame = haveFrame(aFrame);
	let ix = getColIx(aFrame, colName);
	mapFn = mapFn || identity;
	let dict = new MultiDict();
	aFrame.data.forEach(row => dict.set(mapFn(row[ix]), row));
	let arr = Object.keys(dict.dict).map(key => [key, new Frame( dict.dict[key], aFrame.columns, ''+key)]);
	return zipToDict(arr);
}

