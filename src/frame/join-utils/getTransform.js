
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

