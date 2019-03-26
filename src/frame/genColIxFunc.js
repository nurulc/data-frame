import haveFrame from './haveFrame';

/**
 * [genColIxFunc description]
 * @param  {[type]} aFrame [description]
 * @return {[type]}        [description]
 */
export default  function genColIxFunc(aFrame) {
	aFrame = haveFrame(aFrame);
	return ((name) => { let ix = aFrame.colIx(name); 
		if(ix < 0) {
			//console.log('col: '+name+ ' does not Exist in Frame: '+aFrame.name, aFrame);
			throw new Error('col: '+name+ ' does not Exist in Frame: '+aFrame.name);
		}
		return ix;
	});
}


