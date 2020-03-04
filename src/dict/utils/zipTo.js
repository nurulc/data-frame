
export default function zipTo(aDictType){
	return function(aListOfPairs) {
		return aListOfPairs.reduce( (dict, [k,v]) => aDictType.put(k,v), aDictType);
	};
}

