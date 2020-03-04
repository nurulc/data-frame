
import getColIx from './getColIx';
import {MultiDict} from './MultiDict'
import haveFrame from '../../frame/haveFrame';
import {Frame} from './frame';

/**
 * Returns an array of Frames, for each group
 * the name of the Frameis the value of the grouping
 * @param  {[type]} aFrame  [description]
 * @param  {[type]} colName [description]
 * @param  {[type]} cmp     [description]
 * @param  {[type]} mapFn   [description]
 * @return {[type]}         [description]
 */
export default function groupByToDict(aFrame, colName, cmp,mapFn) {
	aFrame = haveFrame(aFrame);
	let ix = getColIx(aFrame, colName);
	mapFn = mapFn || identity;
	let dict = new MultiDict();
	
	aFrame.data.forEach(row => dict.set(mapFn(row[ix]), row));
	let arr = Object.keys(dict.dict).map(key => new Frame( dict.dict[key], aFrame.columns, ''+key));

	cmp = cmp || cmpStrNum;
	arr.sort((frame1, frame2) => cmp(frame1.name, frame2.name));
	return arr;
}

