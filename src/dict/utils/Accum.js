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

