
import {Frame} from '../frame';
import haveFrame from '../haveFrame';
import {range} from '../../array';
import getColIx from '../getColIx';
import {dataSplit} from '../../string/csv';

/**
 * [frameCount description]
 * @param  {Frme} aFrame   [description]
 * @param  {string} colName  [description]
 * @param  {function} convName function to convert a name to a new name
 * @return {[name, count]}     a two element array with the name and count
 */
export default function frameCount(aFrame, colName, convName) {
	aFrame = haveFrame(aFrame);
	let name = aFrame.name;
	let ix = getColIx(aFrame,colName);
	
	let sum = aFrame.data.reduce((s,row) => s+(row[ix]?1:0),0);
	if( convName ) return [convName(name), sum];
	return [name, sum];
}
