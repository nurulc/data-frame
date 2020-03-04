
/**
 * Create a FUNCTION resturns  padded (default is '0') string rep of a number
 *
 *  usage: padTo(5)(66) => '00066';
 *   or
 *         let pad3 = padTo(3,' ');
 *			pad3(5) -> '  5'
 *			pad3(45) ->  ' 45'
 *			pad3(666) -> '666'
 *          pad3(76543) -> '76543'
 *
 * @param {number} padLength
 * @param {char} padChar padding char '0' default
 * @return {function} (number) => string
 *
 */
export default  function padTo(padLength, padChar='0') {
	let maxNum = 10, 
		padding = ''; 
	for(let j=0; j<padLength; j++)
	{ 
		maxNum *= 10; 
		padding += padChar; 
	}
	maxNum--;
	return (number) => (number<=maxNum) ? (padding+number).slice(-padLength) : ''+number; 
}



