
import { flatten, range} from '../array';
import {cmpStrNum} from '../utils/sort-helper';
import haveFrame from '../frame/haveFrame';
import getColIx from './getColIx';

/**
 *  Support one => many mapping
 */
export class MultiDict {
	constructor() {
		this._dict = {};
	}

	_elem() { return []; }
	/**
	 * [put description]
	 * @param  {String} key   [description]
	 * @param  {object} value [description]
	 * @return {this}       [description]
	 */
	set(key,value) {
		let list = this._dict[key];
		if( !list ) {
			list = this._elem();
			this._dict[key] = list;
		}
		list.push(value);
		return this;
	}
	/**
	 * [add description]
	 * @param {[type]} key   [description]
	 * @param {[type]} value [description]
	 */
	add(key,value) {
		return this.set(key,value);
	}

	/**
	 * [put description]
	 * @param  {[type]} key   [description]
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	put(key,value) {
		return this.set(key,value);
	}

	/**
	 * [get description]
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	get(key) { return this._dict[key]; }
	getA(key) { return this._dict[key]; }

	/**
	 * [dict description]
	 * @return {[type]} [description]
	 */
	get dict() { return this._dict; }

	/**
	 * [description]
	 * @param  {[type]} k [description]
	 * @return {[type]}   [description]
	 */
	get zip()  { return Object.keys(this.dict).map(k => [k, this._dict[k]]); }

	_toHtml() {
		let keys = Object.keys(this.dict);
		keys = keys.slice(0, Math.min(100,keys.length));
		let head = '<table><tr><td>Key</td><td>Value</td></tr>';
		let body = keys.map(k => '<tr><td>' +htmlEscape(k)+'</td><td>'+htmlEscape(this.dict[k].join(', '))+'</td></tr>');
		let end = '</table>';
		return head+body+end;
	}
}

function htmlEscape(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/'/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/**
 * 
 */
export class MultiDictSet extends MultiDict {
	/**
	 * [put description]
	 * @param  {String} key   [description]
	 * @param  {object} value [description]
	 * @return {this}       [description]
	 */
	put(key,value) {
		let list = this._dict[key];
		if( !list ) {
			list = new Set();
			this._dict[key] = list;
		}
		list.add(value);
		return this;
	}

	/**
	 * [getA description]
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	getA(key) { return Array.from(this._dict[key]); }

	/**
	 * [zip description]
	 * @return {[type]} [description]
	 */
	get zip() {
		return Object.keys(this.dict).map(k => [k, this.getA(k)]);
	}
}

export function zipTo(aDictType){
	return function(aListOfPairs) {
		return aListOfPairs.reduce( (dict, [k,v]) => aDictType.put(k,v), aDictType);
	};
}


export class Accum {
	constructor() {
		this.value = 0.0;
		this._count = 0;
		this._realCount = 0;
		this.value2 = 0.0; //vaule^2
	}
	add(value) {
		let v = +value;
		this._realCount++;
		if(!isNaN(v)){
			this.value += v;
			this.value2 += v*v;
			this._count++;
		}	
	}

	map(fn) {
		return range(this._count).map(i => fn(this.value,i,[this]));
	}

	sum() { return this.value; }
	count() { return this._count; }
	realCount() { return this._realCount; }
	mean() { return this._count?(this.value/this._count):0; }
	stdDiv() {
		if(this._count === 0) return 0;
		let mean = this.mean();
		return Math.sqrt((this.value2-this._count*mean*mean)/(this._count-1.0));
	}
}

/**
 *  Dictionary to count the number of key value pairs,
 *  Note for any key we only support one value, if 
 */
export class SumDict {
	constructor(klass,dflt) {
		this.klass = klass || Accum;
		this._dict = {};
		this._dflt = dflt;
	}

	set(key,value) {
		let acc = this._dict[key];
		if( !acc ) {
			acc = new this.klass();
			this._dict[key] = acc;
		}
		acc.add(value===undefined?this._dflt:value);
		return this;
	}

	add(key,value) {return this.set(key,value); }
	put(key,value) {return this.set(key,value); }
	get(key) {return this._dict[key]; }

	asZip() {
		let keys = Object.keys(this._dict);
		return flatten(
			keys.map(k => {
				let acc = this._dict[k];
				if( !acc ) return [[k, undefined]];
				// O: KEEP
				return acc.map((val) =>[k, val]);
			} ) ,1);
	}

	get dict() { return this._dict; }
}
/**
 * create a dict from zip array - an array of key value pairs
 * @param  {[[key,value]]} aZipList [description]
 * @return {SumDict}          [description]
 */
SumDict.fromZip = function(aZipList) {
	let len = aZipList.length;
	let dict = new SumDict();
	for(let i=0; i< len; i++) {
	  let v = aZipList[i];
	  dict.put(v[0], v[1]);
	}
	return dict;
};

SumDict.count = function(list) {
	let _l;
	if( !Array.isArray(list) && typeof list === 'function') _l = list();
	else _l = list;
	if( _l === undefined || _l.length === undefined || _l.length === 0 ) return [];
	
	let dict = _l.reduce((dict,v) => _dictAdd(dict,v), new Map());

	let l = []/*new Array(list.length)*/, i = 0;
	//dict.forEach((v,k) => l[i++] = [k,v])
	dict.forEach((v,k) => l.push([k,v]));
	//l.length = i;
	return l;
};



function _dictAdd(dict,v) {
	let vx;
	return dict.set(v, ((vx = dict.get(v)) === undefined ? 0 : vx)+1);
}




/**
 * Returns an array of Frames, for each group
 * the name of the Frameis the value of the grouping
 * @param  {[type]} aFrame  [description]
 * @param  {[type]} colName [description]
 * @param  {[type]} cmp     [description]
 * @param  {[type]} mapFn   [description]
 * @return {[type]}         [description]
 */
export function groupByToDict(aFrame, colName, cmp,mapFn) {
	aFrame = haveFrame(aFrame);
	let ix = getColIx(aFrame, colName);
	mapFn = mapFn || identity;
	let dict = new MultiDict();
	
	aFrame.data.forEach(row => dict.set(mapFn(row[ix]), row));
	let arr = Object.keys(dict.dict).map(key => new Frame( dict.dict[key], aFrame.columns, ''+key));

	cmp = cmp || cmpStrNum;
	arr.sort((frame1, frame2) => cmp(frame1.name, frame2.name));
	return arr;
}

/**
 * [groupToDict description]
 * @param  {[type]} aFrame  [description]
 * @param  {[type]} colName [description]
 * @param  {[type]} cmp     [description]
 * @param  {[type]} mapFn   [description]
 * @return {[type]}         [description]
 */
export function groupToDict(aFrame, colName, cmp,mapFn) {
	aFrame = haveFrame(aFrame);
	let ix = getColIx(aFrame, colName);
	mapFn = mapFn || identity;
	let dict = new MultiDict();
	aFrame.data.forEach(row => dict.set(mapFn(row[ix]), row));
	let arr = Object.keys(dict.dict).map(key => [key, new Frame( dict.dict[key], aFrame.columns, ''+key)]);
	return zipToDict(arr);
}

