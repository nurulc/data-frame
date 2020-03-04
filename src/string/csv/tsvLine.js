
import trimListElements from './trimListElements';

export default function tsvLine(line) {
	return trimListElements(line.split('\t'));
	//return line.split('\t').map(x=>x.trim()); // nicer code, but much slower
}
