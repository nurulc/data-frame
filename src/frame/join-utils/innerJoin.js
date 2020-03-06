
import haveFrame from '../haveFrame';
import colName from './colName';
import localGroupBy from './localGroupBy';
import changeNameTo from './changeNameTo';
import joinOp from './joinOp';
import project from './project';
import getDict from './getDict';

/**
 * innerJoin works like an SQL inner join, not quite as flexible, 
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
export function innerJoin(frame1, frame2, projectList, joinOn, filter) {
	frame1 = haveFrame(frame1);
	frame2 = haveFrame(frame2);
	let [newColNames, mapping] = colName(projectList, frame1.columns, frame2.columns);
	// if( 1.5*frame1.length < frame2.length) {
	//   console.log(`Warning: fastJoin - frame1(${frame1.length}) should be longer that frame2(${frame2.length})`);
	// } 
	let [col1, col2] = changeNameTo(joinOn, '==');
	let cmp = joinOp(frame1,frame2, col1, col2,filter); // returns a function that performs the join test
	let [ix1,ix2] = [frame1.colIx(col1), frame2.colIx(col2)];  // get the idex of col1 => ix1 and col2 => ix2
	let transform = project(mapping);         // returns function to perform the projection

	if(frame1.length > frame2.length ){
		let index = localGroupBy(frame2.data, ix2,true); // create an index on col2 values

		let data = frame1.data;
		// 
		//let res = frame1.data.reduce( (res,row)=> matchIt1(res,row,getDict(index,row[ix1]),cmp,transform),[]);
		//
		// Not as clean as to code above but faster
		// 
		
		let len = data.length;
		let res = [];                             // Note 'res' array is mutated during this operation
		for(let i=0; i<len; i++) {
			let row = data[i];
			matchIt1(res,row,getDict(index,row[ix1]),cmp,transform); // note index is a dictionary indexed on col2
		}
		return new frame1.constructor(res, newColNames,frame1.name+'-'+frame2.name);
	} else {
	
		let index = localGroupBy(frame1.data, ix1,true); // create an index on col1 values
		//
		
		//let res = frame2.data.reduce( (res,row)=> matchIt2(res,row,getDict(index,row[ix2]),cmp,transform),[]);
		let data = frame2.data;
		let len = data.length;
		let res = [];

		for(let i=0; i<len; i++) {
			let row = data[i];
			matchIt2(res,row,getDict(index,row[ix2]),cmp,transform);
		}

		return new frame1.constructor(res, newColNames,frame1.name+'-'+frame2.name);
	}

}

/**
 * Match row1 (master row) against all elements of arr, using the cmp function, and return an array of matching rows by using the transform function
 * @param  {Array<string>} res       this array is mutatated (done purely for performance reasons)
 * @param  {[string]} row1      a master row
 * @param  {[[string]]} arr     array of rows
 * @param  {function} cmp       comparison finction that compares row1 with the array of rows (join operation)
 * @param  {function} transform function to transform the to the final rows
 * @return {[string]}           returning array of rows
 */
function matchIt1(res/*modified*/,row1,arr, cmp, transform) {
	let len = arr.length;
	for(let i=0; i< len; i++) {
		let row2 = arr[i];
		if(cmp(row1,row2)) res.push(transform(row1,row2));
	}
	return res;
}



/**
 * Match row2 (master row) against all elements of arr, using the cmp function, and return an array of matching rows by using the transform function
 * @param  {Array<string>} res       this array is mutatated (done purely for performance reasons)
 * @param  {[string]} row2      [description]
 * @param  {[[string]]} arr     array of rows
 * @param  {function} cmp       comparison finction that compares row1 with the array of rows (join operation)
 * @param  {function} transform function to transform the to the final rows
 * @return {[string]}           returning array of rows

 */
function matchIt2(res,row2,arr, cmp, transform) {
	let len = arr.length;
	for(let i=0; i< len; i++) {
		let row1 = arr[i];
		if(cmp(row1,row2)) res.push(transform(row1,row2));
	}
	return res;
}


