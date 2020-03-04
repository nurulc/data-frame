
import haveFrame from '../../frame/haveFrame';
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

