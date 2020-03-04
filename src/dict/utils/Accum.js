
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

