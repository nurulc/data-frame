
import {Frame} from '../frame';
import haveFrame from '../haveFrame';
import {range} from '../../array';
import getColIx from '../getColIx';
import {dataSplit} from '../../string/csv';

/**
 * [frameSum description]
 * @param  {Frme} aFrame   the frme to operate on
 * @param  {string} colName  name of the column to sum
 * @param  {function} convName optional function to convert a name to a new name
 * @param  {function} convValue optional function to conver the value
 * @return {[type]}           [description]
 */
export default function frameSum(aFrame, colName, convName, convValue) {
	aFrame = haveFrame(aFrame);
	let name = aFrame.name;
	let ix = getColIx(aFrame,colName);
	let sum = aFrame.data.reduce((s,row) => s+row[ix],0);
	let nn = ( convName  ) ? convName(name) : name;
	let nv = ( convValue ) ? convValue(sum) : sum;
	return [nn, nv];
}

