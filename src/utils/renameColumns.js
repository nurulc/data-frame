


export default function renameColumns(frame,map) {
	return frame.columns.map(c => map[c]?map[c]:c);

}