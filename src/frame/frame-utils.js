// jshint undef:true
// jshint unused:true
import {Frame} from './frame';
import {arrEqual, zipToDict, arrDedup, range} from '../array';
import getColIx from './getColIx';
import haveFrame from './haveFrame';
import {dataSplitter} from '../string/csv';



/**
 * default splitter is pipe seperated values
 * @param  {[type]} buffer    [description]
 * @param  {[type]} frameName [description]
 * @param  {[type]} splitter  [description]
 * @return {[type]}           [description]
 */
export function frameFromBuffer(buffer,frameName,splitter) {
	let arr = buffer.split('\n');
	let columns = splitter(arr[0]);
	let array = dataSplit(arr.splice(1),splitter);
	return new Frame(array,columns,frameName);

}


/**
 * [frameWithIndex description]
 * @param  {[type]} aFrame [description]
 * @return {[type]}        [description]
 */
export function frameWithIndex(aFrame, atEnd) {
	if( ! aFrame ) return new Frame([],[]);
	aFrame = haveFrame(aFrame);
	let cols;
	if(atEnd) 	cols = [...aFrame.columns.filter(n => n !== '_INDEX'),'_INDEX']
	else 		cols = ['_INDEX', ...aFrame.columns.filter(n => n !== '_INDEX')]
	return aFrame.project(cols, {_INDEX: (_,ix) => ''+ix});
	//let ix = aFrame.colIx('_INDEX');
	// if( ix !== -1) return aFrame.project(['_INDEX', ...aFrame.columns.filter(n => n !== '_INDEX')], {_INDEX: (_,ix) => ''+ix});
	// return aFrame.project(['_INDEX', ...aFrame.columns], {_INDEX: (_,ix) => ''+ix});
}

/**
 * [frameSum description]
 * @param  {[type]} aFrame    [description]
 * @param  {[type]} colName   [description]
 * @param  {[type]} convName  [description]
 * @param  {[type]} convValue [description]
 * @return {[type]}           [description]
 */
export function frameSum(aFrame, colName, convName, convValue) {
	aFrame = haveFrame(aFrame);
	let name = aFrame.name;
	let ix = getColIx(aFrame,colName);
	let sum = aFrame.data.reduce((s,row) => s+row[ix],0);
	let nn = ( convName  ) ? convName(name) : name;
	let nv = ( convValue ) ? convValue(sum) : sum;
	return [nn, nv];
}

/**
 * [frameCount description]
 * @param  {[type]} aFrame   [description]
 * @param  {[type]} colName  [description]
 * @param  {[type]} convName [description]
 * @return {[type]}          [description]
 */
export function frameCount(aFrame, colName, convName) {
	aFrame = haveFrame(aFrame);
	let name = aFrame.name;
	let ix = getColIx(aFrame,colName);
	
	let sum = aFrame.data.reduce((s,row) => s+(row[ix]?1:0),0);
	if( convName ) return [convName(name), sum];
	return [name, sum];
}

/**
 * [transpose description]
 * @param  {[type]} frame [description]
 * @param  {[type]} pivot [description]
 * @return {[type]}       [description]
 */
export function transpose(frame, pivot) {
	let len = frame.length;
	let columns = frame.columns;
	let data = columns.filter(c => c !== pivot).map((c,ix) => [c, ...frame.rawColumn(c)]);
	let newColumns = (columns.indexOf(pivot) !== -1? frame.rawColumn(pivot):range(len)).map(v => ''+v);
	return new frame.constructor(data, newColumns, 'transpose-'+(frame.name||'frame'));
}

/**
 * [frameToString description]
 * @param  {[type]} aFrame [description]
 * @return {[type]}        [description]
 */
export function frameToString(aFrame) {
	aFrame = haveFrame(aFrame);
	let headers = aFrame.columns.join('\t');
	let lines = aFrame.data.map( l => l.join('\t'));
	return headers+'\n'+lines.join('\n');
}

// =============================
// tuned for frame array
// 

function isSorted(arr /* may not be sorted sorted*/) {
	let len=arr.length-1;
	for(let i=0;i<len;i++){
		if(colCMP(arr[i],arr[i+1]) > 0 ){
			return  undefined;
		}
	}
	return true;
}

function _union2(sortedA, sortedB) {
	let lenA = sortedA.length;
	let lenB = sortedB.length;
	if( lenA === 0 ) return sortedB;
	if( lenB === 0 ) return sortedA;
		
	if( lenA === 1 && lenB === 1) {
		if(colEQ(sortedA[0], sortedB[0])) return sortedA;
	}
	else if( lenA === 1 ) return _union2(sortedB, sortedA);
	else if( lenB === 1 ) {
		let b0 = sortedB[0];
		let a0 = sortedA[0];
		if(lenA === 1 ) {
			if(colEQ(a0, b0)) return sortedA;
		} else {
			if( colEQ(b0,a0) ) return sortedA;
			if( colEQ(b0, sortedA[lenA-1])) return sortedA;
		}
	}
	let res = [];
	let j=0, i=0;
	//let iA = sortedA[0];
	for(; i< lenA && j< lenB; i++) {
		let iA = sortedA[i];
		do {
			let jB = sortedB[j]; 
			//console.log(iA,jB);
			let cmpRes = colCMP(iA,jB); // compare the values
			if(/*iA > jB*/ cmpRes > 0) {
				res.push(jB);
				j++;
				if( j >= lenB) {
					res.push(iA);
					break;
				}
			} else if( /*iA === jB*/ cmpRes === 0 ){
				res.push(iA); 
				j++;
				break;
			} else {
				res.push(iA);
				break;
			}
		} while( j < lenB );
	}
	while(j<lenB) res.push(sortedB[j++]);
	while(i<lenA) res.push(sortedA[i++]);
	return res;   
}




 /**
 * assumes the frames are sorted, if notSorted is true, then the frames are sorted first;
 * requirements:
 * 1. the frames must have the same columns names
 * 2. the sorting is done in columns order
 * 3. The original fames are not modified  * @param  {[type]} frame1    [description]
  * @param  {[type]} frame1    [description]
  * @param  {[type]} frame2    [description]
  * @param  {[type]} notSorted [description]
  * @return {[type]}           [description]
  */
export function unionFrame(frame1, frame2, notSorted) {
	frame1 = haveFrame(frame1);
	frame2 = haveFrame(frame2);
	if( !colEQ(frame1.columns, frame2.columns) ) throw new Error('frames do not have the same columns: ('+frame1.comums.join(',')+')  ('+frame2.comums.join(',')+')');
	let data1 = frame1.data, data2 = frame2.data;

	if(notSorted) {
		if(!isSorted(data1)) data1 = data1.slice(0).sort(colCMP);
		if(!isSorted(data2)) data2 = data2.slice(0).sort(colCMP);
	}
	let arr = _union2(data1, data2);
	return new Frame(arr, frame1.columns, 'union');
}
