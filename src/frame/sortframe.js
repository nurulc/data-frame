// jshint undef:true
// jshint unused:true

import haveFrame from './haveFrame';
import { arrEQ } from '../array';
import {combineCmp, cmpNumOrStrBy,  revCmp} from '../utils/sort-helper';
import genColIxFunc from './genColIxFunc';


/**
 * create a comparison function for a frame
 * usage sortFrameBy(['+surname', 'givenName', '-age'], aFrame)
 * + == ascending
 * - == descending 
 * @param  {[type]} columnNames [description]
 * @param  {[type]} aFrame      [description]
 * @param  {[type]} cmpFn       [description]
 * @return {[type]}             [description]
 */
export default function sortFrameBy(columnNames,aFrame,cmpFn=cmpNumOrStrBy) {
	aFrame = haveFrame(aFrame);
	// function to get the index of the column given a name
	
	if(!columnNames || !columnNames.length || arrEQ((aFrame.sorted||[]), columnNames)) return aFrame;
	let colIx = genColIxFunc(aFrame);
	//create a comparison function give an column name
	// -name (sort acending) +name or name, to sort descending	                
	let cmps = (name) => name[0]==='-'?revCmp(cmpFn(colIx(name.substr(1))))
		: (name[0] === '+'?cmpFn(colIx(name.substr(1))):
			cmpFn(colIx(name)));
	let data = aFrame.data.slice(0);
	data.sort(combineCmp(...columnNames.map(cmps)));
	let resFrame = new aFrame.constructor(data,aFrame.columns, aFrame.name, aFrame.keyFunc);
	resFrame.sorted = columnNames;
	return resFrame;
}