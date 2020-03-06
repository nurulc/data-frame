
import haveFrame from '../haveFrame';
import getTransform from './getTransform';
import localGroupBy from './localGroupBy';
import changeNameTo from './changeNameTo';
import joinOp from './joinOp';
import project from './project';
import getDict from './getDict';
import matchIt from './matchIt';
import {reverseProjectList1} from './reverseProjectList1';

/**
 * leftJoin works like an SQL inner join, not quite as flexible, 
 *     select a as A, b, frame1.x from frame1, frame2
 *         where frame1.colName1 = frame2.colName2 and {filter} 
 *
 * 
 * @param  {Frame} frame1      [description]
 * @param  {Frame} frame2      [description]
 * @param  {Array<string>} projectList Array of column name mapping example ""
 * @param  {String} joinOn      column name to join on, either "colName" (same name exists on both frame) or "colName1=colName2" (colName1 - column from frame1, colName2 - column from frame2)
 * @param  {function} filter    *optional filter function - filter(row1,row2)
 * @return {Frame}             resulting frame
 */
export function leftJoin(frame1, frame2, projectList, joinOn,filter) {
	frame1 = haveFrame(frame1);
	frame2 = haveFrame(frame2);

	let {transform, newColNames, mapping} = getTransform(projectList, frame1.columns, frame2.columns);
	let pL = reverseProjectList1(projectList, col1,col2, frame1.columns, frame2.columns);
	let transformR = getTransform(pL, frame1.columns, frame2.columns).transform;  // if( 1.5*frame1.length < frame2.length) {
	//   console.log(`Warning: fastJoin - frame1(${frame1.length}) should be longer that frame2(${frame2.length})`);
	// } 
	let [col1, col2] = changeNameTo(joinOn, '==');
	let cmp = joinOp(frame1,frame2, col1, col2,filter);
	let [ix1,ix2] = [frame1.colIx(col1), frame2.colIx(col2)];
	//let transform = project(mapping);         // reansform function
	
	let res = [];
	let index = localGroupBy(frame2.data, ix2,true);
	let data = frame1.data;
	//data.reduce( (res,row)=> matchIt(res,row,getDict(index,row[ix1])),res);
	let tr = [transform,transformR];
	let len = data.length;
	for(let i=0; i< len; i++) {
		let row = data[i];
		matchIt(res,row,getDict(index,row[ix1]),cmp,tr);
	}

	return new frame1.constructor(res, newColNames);
	
}

