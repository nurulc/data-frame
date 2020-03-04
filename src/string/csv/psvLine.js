
import trimListElements from './trimListElements';

export default function psvLine(line) {
	return trimListElements(line.split('|'));
	//return line.split('|').map(x=>x.trim()); // nicer code but much slower
}

