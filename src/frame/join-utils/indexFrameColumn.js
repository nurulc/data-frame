
import haveFrame from '../haveFrame';
import localGroupBy from './localGroupBy';
/**
 * Creates a index for a column (dictionary)
 * @param  {Frame}   aFrame  Fram to index
 * @param  {String}  colName name of the column to index
 * @param  {boolean} noNull  Optional (false) if false, null is added to the dictionary
 * @param  {Object}  dict    Optional
 * @return {Dict}            Dict[key] --> array of columns that contain the key in column(colName). Note a row is an array of columns
 */
export default  (aFrame,colName,noNull=false,dict={}) => {
	aFrame = haveFrame(aFrame);
 
	let ix = aFrame.colIx(colName);
	return localGroupBy(aFrame.data,ix,noNull,dict);
};


