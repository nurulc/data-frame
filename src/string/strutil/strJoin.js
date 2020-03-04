
// Bunch of str 

// String reverse, looks to be the 
// import {getLie,getCol}   from '../bundle/claimutils';

/**
 * join an array of strings ignoring empty values
 * @param  {[String]} arrOfStrings array of strings
 * @param  {String} sep          seperator string
 * @return {String}              return a string of values seperated by 'sep' string
 */
export default  function strJoin(arrOfStrings, sep='') {
	if(arrOfStrings === undefined || arrOfStrings.length === 0) return '';
	if(typeof arrOfStrings === 'string') return arrOfStrings;
	if( !Array.isArray(arrOfStrings)) throw new Error('Array of strings expected: recieved '+arrOfStrings);
	let s = '';
	let sp = '';
	for(let i=0; i< arrOfStrings.length; i++) {
		let ss = arrOfStrings[i];
		if(!ss) continue;
		s += sp; s += ss;
		sp = sep;
	}
	return s;
}

