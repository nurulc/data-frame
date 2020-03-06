/*local*/
export default function project(mappingList) {
	return function (array1, array2) {
		let data = [array1,array2];
		return mappingList.map(([frameIx, oldIx, newIx]) => oldIx === -1? '':data[frameIx][oldIx]);
	};
}

