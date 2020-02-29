import {StrDict} from './strdict';
import {EMPTY_ARRAY} from '../utils/constants';


/**
 * 
 */
export class LineIterator {
	/**
	 * [constructor description]
	 * @param  {[type]} sep [description]
	 * @param  {[type]} len [description]
	 * @return {[type]}     [description]
	*/
	constructor(sep,len) {
		this.sep = sep || ', ';
		this.slen = this.sep.length;
		this.pos = 0;
		this.len = 0;
		this._line = '';
		// managing a string dictionary that minimizes string allocations
		this.dict = new StrDict(len) ;
	//this.token = new Token('',0,0);
	}
	/**
	* [line description]
	* @param  {[type]} aLine [description]
	* @return {[type]}       [description]
	*/
	line(aLine) {
		this._line = aLine;
		this.pos = 0;
		this.len = aLine?aLine.length:0;
		//this.token.set(aLine,0,0);
		return this;
	}

	/**
	 * [get description]
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	get(str) {
		return this.dict.getV(str);
	}

	getV(str) {
		return this.dict.getV(str);
	}
	/**
	 * [next description]
	 * @return {Function} [description]
	 */
	next() {
	//LOG("NEXT(pos/len)", this.pos, this.len, this.sep)
		let len = this.len;
		if( this.pos >= len) return undefined;
		let end = this._line.indexOf(this.sep, this.pos);

		//LOG("end",end);
		let newPos = end + this.slen;
		if( end === -1) {
			end = len;
			newPos = len;
		}
		else {
			newPos = end+this.sep.length;
			//LOG("newpos", newPos,this.sep.length);
		}
		let str = this.dict.get(this._line, this.pos,end);
		this.pos = newPos;
		//LOG("*NEXT(pos/len)", this.pos, this.len, this.sep)
		return str;
	}

} 


/**
 * Concat a list of token
 *
 * The advantage over str.split(seperator) is that less garbage is created
 * The iteration has an internal dictionary of string so, the same token string 
 * will map to the same string 
 * 
 * @param  {[string]} arr     a single string, or and array of strings
 * @param  {[type]} li      a Line iterator that picks up tokens
 * @param  {[type]} strLine optional string to initialize the iterator
 * @return {[type]}         [description]
 */
export function _concatLi(arr, li, strLine) {
	if( arr === undefined && strLine === '' ) return EMPTY_ARRAY;
	let rl = []; 
	if( Array.isArray(arr) ) {
		if( strLine === '') return arr;
		let len = arr.length;
		for(let i=0; i<len; i++) {
			if( arr[i] ) rl.push(li.getV(arr[i]));
		}
	}
	else if(arr) rl.push(li.getV(arr));

	if(strLine !== undefined) li.line(strLine);
	else return rl;
	let str;
	while( (str = li.next()) ) {
		rl.push(str); 
	}
	return rl;
} 






