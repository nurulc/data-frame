import BaseFrame from './BaseFrame';


export default function haveFrame(aFrame) {
	if(!aFrame) throw new Error('Frame expected - but undefined supplied');
	if( ! (aFrame instanceof BaseFrame) ) throw new Error('Frame expected - but supplied: '+objName(aFrame));
	return aFrame;
}


