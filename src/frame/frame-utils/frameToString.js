
import haveFrame from '../haveFrame';
/**
 * [frameToString description]
 * @param  {[type]} aFrame [description]
 * @return {[type]}        [description]
 */
export default function frameToString(aFrame) {
	aFrame = haveFrame(aFrame);
	let headers = aFrame.columns.join('\t');
	let lines = aFrame.data.map( l => l.join('\t'));
	return headers+'\n'+lines.join('\n');
}

