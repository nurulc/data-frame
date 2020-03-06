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
 
/**
 * combine a set of sorting comparison functions
 * @param  {...[type]} funcs [description]
 * @return {[type]}          [description]
 */
export default function combineCmp(...funcs) {
	let len = funcs.length;
	//funcs.find(f => (res=f(a,b))!==0); // clean but not so fast, below is fater
	switch(len){
	case 0: return () => 0;
	case 1: return funcs[0];
	case 2: return ((a,b) => funcs[0](a,b) || funcs[1](a,b));
	case 3: return ((a,b) => funcs[0](a,b) || funcs[1](a,b) || funcs[2](a,b));				
	default: 
	{
		return (
			(a,b) => 
			{
				for(let i=0; i<len; i++) {
					let res = funcs[i](a,b);
					if( res !== 0) return res;
				}
				return 0;
			});
	}
	}	
}
