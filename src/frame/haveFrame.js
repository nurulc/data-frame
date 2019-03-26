import {Frame} from './frame';

export default  function haveFrame(aFrame) {
	if(!aFrame) throw new Error('Frame expected - but undefined supplied');
	if( ! (aFrame instanceof Frame) ) throw new Error('Frame expected - but supplied: '+objName(aFrame));
	return aFrame;
}

function objName(o) {
	if(typeof o === 'object' ) return o.constructor.name;
	return typeof o;
}


