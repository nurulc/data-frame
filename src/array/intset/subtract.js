
/**
 * Set subtraction:  fromSet - elementsToRemove, assumes both sets are are represented by sorted array, and as per set definition there are no dups 
 * @param {[Array]} fromSet array - array(set) of sorted elements (ascending order) and no duplicated
 * @param {[Array]} elementsToRemove array(set) - array of sorted elements (ascending order) and no duplicated
 * @return {[Array]} a new set, where (∀ x ∈ fromSet), then  (x ∈ result), if and only if (x ∉ elementsToRemove).
 */
export default function subtract(fromSet,elementsToRemove) {
	let res = [];
	let j=0;
	const f_len=fromSet.length | 0;
	const r_len = elementsToRemove.length | 0;
	for(let i =0; i<f_len ;i++) {
		//console.log(i,j, ";",fromSet[i], elementsToRemove[j])
		if( j>= r_len || fromSet[i] < elementsToRemove[j]) {
			res.push(fromSet[i]);
		} else {
			while(j<r_len && fromSet[i] > elementsToRemove[j]) j++;
				
			if( j>=r_len || fromSet[i] != elementsToRemove[j] ) res.push(fromSet[i]);
			else j++;
		}
	}
	return res;   
}


//subtract([1,2,3,4],[2,3,9])  -> [1,4]  


