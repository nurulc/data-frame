// jshint undef:true
// jshint unused:true
/*
Copyright (c) 2020, Nurul Choudhury
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

import haveFrame from '../haveFrame';
import getTransform from './getTransform';
import changeNameTo from './changeNameTo';
import joinOp from './joinOp';
import project from './project';
/**
 *		 example of a join
 *
 *		 innerJoin(frame1,frame2, [list-of-cols in resulting table], "join-col1==join-col2")
 *		 
 * @param  {Frame} frame1      [description]
 * @param  {Frame} frame2      [description]
 * @param  {[string]} projectList the list of final column names
 * @param  {string} joinOn      either a common column name, or a ttring of the form 'col1==col2'
 * @param  {function} filter    filter function
 * @return {Frame}             a Frame resulting from the inner join
 */
export default function fullInnerJoin(frame1, frame2, projectList, joinOn,filter) {
	frame1 = haveFrame(frame1);
	frame2 = haveFrame(frame2);
	
	let {newColNames, transform, mapping} = getTransform(projectList, frame1.columns, frame2.columns);
	//console.log(mapping);
	let [col1, col2] = changeNameTo(joinOn, '==');
	let cmp = joinOp(frame1,frame2, col1, col2,filter);
	//let transform = project(mapping);         // reansform function
	let res = [];
	return new frame1.constructor(frame1.data.reduce((res, row1) => matchIt(res,row1),[]), newColNames);

	//============
	function matchIt(res,row1) {
		frame2.data.filter( row2 => cmp(row1,row2)).forEach( r => res.push(transform(row1, r)));
		return res;
	}
}

