
import {Frame} from '../frame';
import haveFrame from '../haveFrame';
import {range} from '../../array';
import getColIx from '../getColIx';
import {dataSplit} from '../../string/csv';

/**
 * [transpose description]
 * @param  {[type]} frame [description]
 * @param  {[type]} pivot [description]
 * @return {[type]}       [description]
 */
export default function transpose(frame, pivot) {
	let len = frame.length;
	let columns = frame.columns;
	let data = columns.filter(c => c !== pivot).map((c,ix) => [c, ...frame.rawColumn(c)]);
	let newColumns = (columns.indexOf(pivot) !== -1? frame.rawColumn(pivot):range(len)).map(v => ''+v);
	return new frame.constructor(data, newColumns, 'transpose-'+(frame.name||'frame'));
}

