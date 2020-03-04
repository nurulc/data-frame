
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


