
import {Frame} from '../frame';
import {dataSplit} from '../../string/csv';
/**
 * default splitter is pipe seperated values
 * @param  {[type]} buffer    [description]
 * @param  {[type]} frameName [description]
 * @param  {[type]} splitter  [description]
 * @return {[type]}           [description]
 */
export default function frameFromBuffer(buffer,frameName,splitter) {
	let arr = buffer.split('\n');
	let columns = splitter(arr[0]);
	let array = dataSplit(arr.splice(1),splitter);
	return new Frame(array,columns,frameName);

}



