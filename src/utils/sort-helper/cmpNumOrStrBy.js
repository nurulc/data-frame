
import {cmpStrNum} from './cmpStrNum';
/**
 * comapre string or number (used to sort frames)
 * @param  {[type]} colIX column index
 * @return {function}        (row1, row2) => compares row1[columnIX] to row2[columnIX]
 */
export default  (colIX) => (row1,row2) => (cmpStrNum(row1[colIX],row2[colIX]));
