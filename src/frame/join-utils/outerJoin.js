
import haveFrame from '../haveFrame';
import colName from './colName';
import getTransform from './getTransform';
import localGroupBy from './localGroupBy';
import changeNameTo from './changeNameTo';
import joinOp from './joinOp';
/**
 * [outerJoin description]
 * @param  {[type]} frame1      [description]
 * @param  {[type]} frame2      [description]
 * @param  {[type]} projectList [description]
 * @param  {[type]} joinOn      [description]
 * @param  {[type]} filter      [description]
 * @return {[type]}             [description]
 */
export function outerJoin(frame1, frame2, projectList, joinOn,filter) {
	frame1 = haveFrame(frame1);
	frame2 = haveFrame(frame2);
	//console.log("projectList1:", projectList);
	let {transform, newColNames, mapping} = getTransform(projectList, frame1.columns, frame2.columns);
	let pL = reverseProjectList1(projectList, col1,col2, frame1.columns, frame2.columns);
	//    console.log("projectList3:", pL);
	let transformR = getTransform(pL, frame1.columns, frame2.columns).transform;
	// if( 1.5*frame1.length < frame2.length) {
	//   console.log(`Warning: fastJoin - frame1(${frame1.length}) should be longer that frame2(${frame2.length})`);
	// } 
	let [col1, col2] = changeNameTo(joinOn, '==');
	let cmp = joinOp(frame1,frame2, col1, col2,filter);
	let [ix1,ix2] = [frame1.colIx(col1), frame2.colIx(col2)];
	//let transform = project(mapping);         // reansform function
	
	let res = [];
	let index = localGroupBy(frame2.data, ix2,true);
	let data = frame1.data;
	let used = {};
	//data.reduce( (res,row)=> matchIt(res,row,getDict(index,row[ix1])),res);
	let len = data.length;
	let tr = [transform,transformR];
	for(let i=0; i< len; i++) {
		let row = data[i];
		matchIt(res,row,getDict(index,row[ix1]),cmp,tr);
		used[row[ix1]] = true;
	}

	//now process all elements in frame2 that did not match
	let unused = frame2.data.filter(r => used[r[ix2]] === undefined);
	//console.log("unused", unused)
	//matchIt(res,[], unused,cmp, transform);
	len = unused.length;
	if( len > 0) {
		//console.log("projectList2:", projectList);
		let pL = reverseProjectList2(projectList, col1,col2, frame1.columns, frame2.columns);
		//  console.log("projectList3:", pL);
		let {transform, newColNames, mapping} = getTransform(pL, frame1.columns, frame2.columns);
		for(let i=0; i<len; i++) res.push(transform([],unused[i]));
	}

	return new frame1.constructor(res, newColNames);
	
}

function reverseProjectList1(pL, col1, col2, f1Cols, f2Cols) {

	//console.log("PL0:", pL);
	let c = pL.map(s => s.split('='));
	//console.log("PL1:",  c);
	
	let len = c.length;
	for(let i=0; i<len; i++) {
		let col = c[i];
		if( col[0] === '2.'+col2 || col[0] === col2) col[0] = '1.'+col1;
		else  if( col[0] === col2) col[0] = '1.'+col1;
		else if( col[0].substr(0,2) === '2.' ) {
			if( f1Cols.indexOf(col[0].substr(2)) !== -1 ) col[0] = '1.'+col[0].substr(2);
		}
		else if(col[0].substr(0,2) === '1.') col[0] = col[0];
		else if( f1Cols.indexOf(col[0].substr(2)) !== -1 ) col[0] = '1.'+col[0];
	}
	return c.map( v => v.join('='));
}

function reverseProjectList2(pL, col1, col2, f1Cols, f2Cols) {

	//console.log("PL0:", pL);
	let c = pL.map(s => s.split('='));
	//console.log("PL1:",  c);
	
	let len = c.length;
	for(let i=0; i<len; i++) {
		let col = c[i];
		if( col[0] === '1.'+col1 || col[0] === col1) col[0] = '2.'+col2;
		else  if( col[0] === col2) col[0] = '2.'+col2;
		else if( col[0].substr(0,2) === '1.' ) {
			if( f2Cols.indexOf(col[0].substr(2)) !== -1 ) col[0] = '2.'+col[0].substr(2);
		}
		else if(col[0].substr(0,2) === '2.') col[0] = col[0];
		else if( f2Cols.indexOf(col[0].substr(2)) !== -1 ) col[0] = '2.'+col[0];
	}
	return c.map( v => v.join('='));
}







