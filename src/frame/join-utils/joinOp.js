
import {TRUE} from '../../utils/constants';
/**
 * returns a function that will perform an innet joint test
 * @param  {Frame} frame1 left frame
 * @param  {Frame} frame2 right frame
 * @param  {string} col1   column name 1
 * @param  {string} col2   column name 2
 * @param  {function} filter optional filter function
 * @return {function}        boolean function given two rows returns true if the should be joined
 */
export default function joinOp(frame1, frame2, col1, col2, filter) {
	let c1 = frame1.colIx(col1);
	let c2 = frame2.colIx(col2);
	filter = filter || TRUE;
	return function (row1, row2) {
		return (row1[c1] === row2[c2]) && filter(row1,row2);
	};
}


