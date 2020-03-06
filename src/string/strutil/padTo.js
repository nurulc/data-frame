// jshint undef:true
// jshint unused:true
/*
Copyright (c) 2020, Nurul Choudhury
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

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



