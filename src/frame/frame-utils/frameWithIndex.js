
//
import haveFrame from '../haveFrame';
/**
 * [frameWithIndex description]
 * @param  {Frame} aFrame The frame to add the index to
 * @return {Frame}        new frame with an index column (remove and previous index column)
 */
export default function frameWithIndex(aFrame, atEnd) {
	if( ! aFrame ) return new aFrame.constructor([],[]);
	aFrame = haveFrame(aFrame);
	let cols;
	if(atEnd) 	cols = [...aFrame.columns.filter(n => n !== '_INDEX'),'_INDEX']
	else 		cols = ['_INDEX', ...aFrame.columns.filter(n => n !== '_INDEX')]
	return aFrame.project(cols, {_INDEX: (_,ix) => ''+ix});
}

