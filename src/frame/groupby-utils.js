// jshint undef:true
// jshint unused:true
import {arrDedup } from '../array';
import {toNumber} from '../utils/sort-helper';

function isEmpty(x) {
	return x === undefined || x === null || x === ''; 
}

/**
 * [gbSum description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
export function gbSum(name,newName) {
	newName = newName || name;
	function sum(action,accum,count, val) {
		if( accum === undefined ) accum = 0;
				
		if( action !==1 ) return  [accum,count];
		else {
			let v = toNumber(val);
			return  v===undefined || isNaN(v) ?[accum,count]:[accum+v,count+1];
		}
	}
	return [sum,name,[()=>0,0],newName];
}

/**
 * [gbCount description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
function gbCount(name,newName) {
	newName = newName || name;
	function count(action,accum,count, val) {
		if( accum === undefined ) accum = 0;
		if( action !==1 ) return [count,count];
		return isEmpty(val)?[accum,count]:[accum+1,count+1];
	}
	return [count,name,[()=> 0, 0 ] ,newName];
}

function minOp(a,b) { return cmpStrNum(a,b)<0?a:b; }

/**
 * [gbMin description]
 * @param  {[type]}   name    [description]
 * @param  {[type]}   newName [description]
 * @param  {Function} fn      [description]
 * @return {[type]}           [description]
 */
function gbMin(name,newName,fn) {
	if(fn === undefined && typeof newName === 'function') {
		fn = newName;
		newName = undefined;
	}
	newName = newName || name;
	fn = fn || minOp;
	function min(action,accum,count, val) {
		if( accum === undefined ) accum = fn(val,'');
		return (isEmpty(val) || action !== 1)?[accum,count]:[fn(val,accum)<0?val:accum,count+1];
	}
	return [min,name,[() => undefined,0],newName];
}

function maxOp(a,b) { return cmpStrNum(a,b)>0?a:b; }

/**
 * [gbMax description]
 * @param  {[type]}   name    [description]
 * @param  {[type]}   newName [description]
 * @param  {Function} fn      [description]
 * @return {[type]}           [description]
 */
function gbMax(name,newName,fn) {
	if(fn === undefined && typeof newName === 'function') {
		fn = newName;
		newName = undefined;
	}
	newName = newName || name;
	fn = fn || maxOp;
	function max(action,accum,count, val) {
		if( accum === undefined ) accum = fn(val,'');
		return (isEmpty(val) || action !== 1)?[accum,count]:[fn(val,accum),count+1];	
	}
	return [max,name,[() => undefined,0],newName];
}

/**
 * [gbMean description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
function gbMean(name,newName) {
	newName = newName || name;
	function mean(action,accum,count, val) {
		if( accum === undefined ) accum = 0;
		if( action !== 1) return [(count>0?accum/count:undefined), count];
		let v = toNumber(val);
		return isEmpty(v) ?[accum,count]:[accum+v,count+1];
	}
	return [mean,name,[() => 0,0],newName];
}

/**
 * [gbStdDiv description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @return {[type]}         [description]
 */
function gbStdDiv(name, newName) {
	newName = newName || name;
	function stdDiv(action,[accumSq,accum],count, val) {
		if( accum === undefined ) accum = [0,0];
		if( action === 1) {
			if(count>1) return [Math.sqrt((count*accumSq-accum*accum)/count*(count-1.0)),count];
			else if(count > 0) return[[undefined,accum/count], count];
			else return [[undefined,undefined],0];
		}
		let v = toNumber(val);
		return isEmpty(v) ?[[accumSq,accum],count]:[[accumSq+v*v,accum+v],count++];
	}
	return [stdDiv,name,[() => [0,0],0],newName];
}

function accStr(accum,val) {
	if( val ) accum.push(val);
	return accum;
}

/**
 * [gbMerge description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @param  {[type]} sep     [description]
 * @return {[type]}         [description]
 */
function gbMerge(name,newName,sep) {
	newName = newName || name;
	sep = sep || ', ';
	function merge(action,accum,count, val) {
		if( accum === undefined ) accum = [];
		if( action !== 1) return [(accum.length===1?accum[0]:accum.join(sep)), count];
		return isEmpty(val) ?[accum,count]:[accStr(accum,val),count+1];
	}
	return [merge,name,[() => [],0],newName];
}


/**
 * [gbMergeU description]
 * @param  {[type]} name    [description]
 * @param  {[type]} newName [description]
 * @param  {[type]} sep     [description]
 * @return {[type]}         [description]
 */
function gbMergeU(name,newName,sep) {
	newName = newName || name;
	sep = sep || ', ';
	function merge(action,accum,count, val) {
		if( accum === undefined ) accum = [];
		if( action !== 1) {
			accum = accum.sort();
			accum = arrDedup(accum);
			return [(accum.length===1?accum[0]:accum.join(sep)), count];
		}
		return isEmpty(val) ?[accum,count]:[accStr(accum,val),count+1];
	}
	return [merge,name,[() => [],0],newName];
}
//we should later gbMode (most occuring value), gbMedian (middle value)

export const gb = { stdDiv: gbStdDiv, mean: gbMean, count: gbCount, sum: gbSum, min: gbMin, max: gbMax, merge: gbMerge, mergeU: gbMergeU };
