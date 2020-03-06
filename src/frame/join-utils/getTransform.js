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

import project from './project';
import colName from './colName';
/**
 * Takes two column list (or one) and a mapping list and returns a transform function
 * That will create a new row taking columns from each of the lists 
 * @param  {[string]} projectList example ['1.DX=DX1', '2.DX=DX2', '1.FX=F1', ...], ['DX','FX',...],['DX',...]
 * @param  {[string]} cols1       example ['DX','FX',...]
 * @param  {[string]} cols2       example 'DX',...]
 * @return {Object}             return an object of the form {transform, newColumnNames, mapingArray}
 *                              the mapping array = [ ...[<frame number>{0,1}, <old-col-index>, <new-col-index>]]
 */
export default function getTransform(projectList, cols1,cols2) { /*local*/
	let [newColNames, mapping] = colName(projectList, cols1, (cols2 || []));
	let transform = project(mapping); 
	return {transform,newColNames,mapping};
}

