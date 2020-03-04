 
/**
 * combine a set of sorting comparison functions
 * @param  {...[type]} funcs [description]
 * @return {[type]}          [description]
 */
export function combineCmp(...funcs) {
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
