
import {MultiDict} from './MultiDict'
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
