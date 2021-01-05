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

import {toNumber} from '../utils/sort-helper';
import haveFrame from './haveFrame';
import genColIxFunc from './genColIxFunc';
import isFunction from '../utils/types/isFunction';

const  isString = (s) =>  (typeof s) === 'string';


/*

		

*/
/**
 * The frame should already be sorted by the groupBy order, or
 * @param  {[type]} groupColsOrig [description]
 * @param  {[type]} aFrame        [description]
 * @param  {[type]} accumList     [description]
 * @return {[type]}               [description]
 */
export function groupBy(groupColsOrig,aFrame, accumList) {
	aFrame = haveFrame(aFrame);
	accumList = accumList || [];
	let newNameMap = [];
	let groupColsOrigNew = groupColsOrig.map(colTransform(newNameMap));
	let groupCols = groupColsOrigNew.map( (name,i) => isString(name)? name: genAccFunc(name,aFrame,i) );
	let change = genChange(groupCols,aFrame);
	let plen = groupCols.length;
	//groupCols = groupCols.filter(v => v);
	let accList = accumList.map( (fn,ix) => genAccFunc(fn,aFrame,plen+ix) );
	let crResult = fillResult(groupCols,accList);
	//console.log('groupCols/accList', groupCols, accList.length)
	let colNames = groupCols.map(getColName).concat(accList.map(f => f()));
	//console.log('colNames',colNames)
	accList = groupCols.filter(v => isFunction(v)).concat(accList);
	//console.log(colNames);
	let data = aFrame.data;
	let len = aFrame.length;
	let dataRes = [];
	let accLen = accList.length;
	for(let i=0; i<len; i++) {
		let row = data[i];
		let [transition,prev] = change(row,i);
		//console.log('Trans/prev',transition, prev)
		let result;
		if( transition === 2) {
			result = crResult(prev);
			//console.log('crResult', prev, result);
			dataRes.push(result);
		} else if( transition === 0 ) {
			for(let j=0; j<accLen; j++) accList[j](0,row);
		} 
		for(let j=0; j<accLen; j++) accList[j](1,row); 
	} 
	if( len >0 ) { 
		let prev = change([],-1)[1];
		dataRes.push(crResult(prev));
	}
	return new aFrame.constructor(dataRes,mapNames(colNames, newNameMap),aFrame.name+'grouped');
}

function colTransform(nameMap) {
	return ( name => {
		if(!isString(name) || (name.indexOf('=') === -1)) { // function or no name change
			nameMap.push(undefined);
			return  name;
		}
		let [oldName, newName] = name.split('=');
		nameMap.push(newName);
		return oldName;
	});
}

function mapNames(colNames, newNameMap) {
	return colNames.map( (n,i) => newNameMap[i] || n);
}

/*
	 Adapter that take the groupby function sum(), count() ...
	 and incorporates it in the groupby scanner.
*/

function genAccFunc([func,name,[init, countInit],newName],aFrame, newIx) {
	let cIx = genColIxFunc(aFrame)(name); 
	let accum = init();
	let counter  = 0;
	return function (transition,aRow) {
		if(arguments.length === 0) return newName;
		let res,r;
		switch(transition) {
		case 2: // finalize - when we come to the e
			res = func(2,accum,counter);
			accum = init();
			counter = countInit;                    
			return res;
		case 0: // initialize;
			accum = init();
			counter = countInit;
			break;
		case 1: // accumulate
			[accum,counter] = func(1,accum,counter, aRow[cIx],aRow); //[accum,counter]
			return counter;
		}
	};
}

var RET_FIRST = [0];
var RET_NOCHANGE = [1];
/*

		Helper function for groupBy, assumes that data is sorted in the groupBy order,
		then it detects when we move from one group to another
*/
function genChange(cols,aFrame) {
	aFrame = haveFrame(aFrame);
	let changeSet = cols.map(() => undefined);
	let cIx = genColIxFunc(aFrame);
	//let len = aFrame.columns.legth;
	let ixList = cols.filter(name => isString(name)).map(name => cIx(name));
	return function(row,ix) {
		//console.log('trans',res,changeSet );
		let ln = ixList.length;
		for(let i=0; i<ln; i++) {
			let pi = ixList[i]|0;
			if( row[pi] === changeSet[i]) continue;
			// something changed
			let res = ixList.map(i => row[i]);
			let prev = changeSet;
			changeSet = res;
			return ix===0?RET_FIRST:[2, prev];           
		}
		return RET_NOCHANGE;
	};
}

function fillResult(groupCols, compList) {
	let names = groupCols.filter(name => isString(name));
	//let index = groupCols.map( v => );
	let ixL = groupCols.map((nameOrFunc) => {
		let ix = names.indexOf(nameOrFunc);
		//console.log(ix, isString(nameOrFunc)?nameOrFunc:'Func()');
		return ix !== -1 ?((row) => row[ix]):( (row) => nameOrFunc(2,row)[0]);  //name may be a string or mapping function
	});
	ixL = ixL.concat(compList|| []);
	return function(prev) {
		let res = ixL.map( fn => fn(prev) );
		return res;
	};
}



function getColName(name) {
	if(isString(name)) return name;
	if(isFunction(name)) return name();
	//return name();
	throw new Error('String or function expected - but got '+name);
}
