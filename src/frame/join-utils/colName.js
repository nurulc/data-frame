
import changeNameTo from './changeNameTo';
/**
 * colName(['1.DX=DX1', '2.DX=DX2', '1.FX=F1', ...], ['DX','FX',...],['DX',...])
 * 
 * returns [ [new-col-list], [ col-mapping]]
 * where <col-mapping> =         [<frame number>{0,1}, <old-col-index>, <new-col-index>] 
 * result od the code above
 * [ [ 'DX1', 'DX2', 'F1', ...], [ [ 0, 0, 0 ], [ 1, 0, 1 ], [ 0, 1, 2 ], ...] ]
 *
 * Note: 
 * @param  {[string]} list  resulting column map
 * @param  {[string]} colsNameList1 [description]
 * @param  {[string]} colsNameList2 [description]
 * @return {[[string],[string]]}       [ [new-col-list], [ col-mapping]]
 */
export default function colName(list, colsNameList1, colsNameList2) { /*local*/
	let res = list.map(s => splitName(s,colsNameList1,colsNameList2));
	return [newCols(res), newColMapping(res,[colsNameList1,colsNameList2])];
}

/**
 * [newCols description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
function newCols(list)  { 
	var l = list.map( ([_,[old,newS]]) => newS);
	return l.reduce(([list,dict],name) => convert(dict,list,name), [[],{}])[0];
		
	function convert(dict,list,name) {
		let newName = name;

		// make sure newName is a name not in the dictionary(of existing column names)
		// keep on generating names until we find a uniqie one.
		for(let i=1; dict[newName]; i++) {
			newName = name + '' +i;
		}
		dict[newName] = true; // name is in the list of columns names
		list.push(newName);   // we are building this list of column names
		return [list,dict];
	} 
		
}

/**
 * [newColMapping description]
 * @param  {Array} list    [ ...[tableIx, [oldColName,newColName]]]
 * @param  {[colsFronTablw1,colsFromTable2]} mapping [description]
 * @return {[type]}         [description]
 */
function newColMapping(list, mapping) {
	return list.map(([tableIx, [oldColName,newColName]]) => [ tableIx, oldToNew(tableIx, oldColName)]);
	//===
	function oldToNew(tableIx, name) {
		let i = mapping[tableIx].indexOf(name);
		if( i === -1) throw new Error('column: '+name+' not found in frame'+ix + ' '+mapping[ix].map(s => `"${s}"`).join(','));
		return i;
	}
}                              

/**
 * Categorize the a column description in a join operation, i.e we are joining two tables 
 * exanples.  
 * 		'city' - column city is only in one table
 * 		'1.city' - use the city column from table1 (optional if city is only in table1 but compulsory if city is in bolh tables)
 * 		'2.population'  
 * 		'2.st=state'
 *
 * 
 * 	1. Which table it comes from - e.g. '1.name' - column 'name' from first table; or '2.desc' - column 'desc' from second table 
 * 	2. What name should it be given in the result table i.e.   '1.name=FullName' 
 * 	3. Can the table, for a column name, be identified unambigiously or must we be explicit; e.g. 'desc' is the same as '2.desc' if table1 does not have a  'desc' column 
 * 	4. Be forgiving and allow disambiguation even if it is unneeded
 * 	5. If we do not give an explicit new name for the target column, use the originam name e.g.  '2.city' the target name is also 'city'
 *
 * 
 * @param  {string} str   Column selection string e.g. '1.name,2.name=newName'
 * @param  {[string]} cols1 arra of columns names
 * @param  {[string]} cols2 [description]
 * @return {[tableIX, [oldColName, finalColName]]}   -     
 */
function splitName(str,cols1,cols2) {
	let res;
	let tables = [cols1,cols2];
	if( /[12]\./.test(str)) {
		res = str.split('.');
	} else {
		let [oldName,newName] = changeNameTo(str, '=');
		let pos1 = cols1.indexOf(oldName);
		let pos2 = cols2.indexOf(oldName);
		if( pos1 === -1 && pos2 === -1) throw new Error('column: '+oldName+ ' not found in table: '+(pos1 === -1?cols1:cols2));
		if( pos1 !== -1 && pos2 !== -1) throw new Error('column: '+oldName+ ' is ambigious');
		res = [pos1===-1?2:1,str];
	}
		
	res[0] = +res[0]-1;
	res[1] = changeNameTo(res[1], '=');
	let [tableId, [oldName, newName]] = res;
	if( tables[tableId].indexOf(oldName) === -1 ) throw new Error('column: '+oldName+ ' not found in table'+(tableId+1) + ' '+tables[tableId]);
	return res;
}


