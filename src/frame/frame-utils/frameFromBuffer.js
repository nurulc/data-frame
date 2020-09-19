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

import {Frame} from '../frame';
import {dataSplit} from '../../string/csv';
/**
 * Create a Frame from a string buffer (string reat from a file)
 * * Lines are seperaed into columns using a 'splitter' supports
 *    * TSV : tab seperated columns  - tsvLine
 *    * CSV : comma seperated values - csvLine
 *    * PSV : pipe (|) seperated values popular in healthcare - tsvLine
 *  
 *  Default splitter (tsvLine) is tab seperated values
 *  
 * @param  {string} buffer    [description]
 * @param  {function} splitter    function to split a string representing a row to an array of strings
 * @param  {{ noConvert: boolen,name: string, Fr: SomeFrameClass}} options
 * @return {Frame}           Frame created from the buffer
 */
export default function frameFromBuffer(buffer,splitter,options={}) {
    let {Fr, name, noConvert} = options;
	Fr = Fr || Frame;
	let arr = buffer.replace(/\r/g, '').split('\n').filter(s => s);
	let columns = splitter(arr[0]);
	let array = dataSplit(arr.splice(1),splitter);
	[columns, array] = cleanData(columns, array);
	var newFrame = new Fr(array,columns,name);
	if(!noConvert) newFrame = newFrame.convertData();
	return newFrame; 
}

function cleanData(columns, array) {
	if( !hasNoEmptyElem(columns) ) throw new Error('Invalid frame column');
	let n = columns.length;
	return [columns, array.map(_cleanData(n)).filter(s => s)];
}


function hasNoEmptyElem(arr, v) {
	if( arguments.length === 1 ){
		for(let i=0; i< arr.length; i++) 
			if(!arr[i]) return undefined;
	} else {
		for(let i=0; i< arr.length; i++) 
			if(arr[i] === v ) return undefined;
	}
	return arr;
}

function arrRemUndef(arr) {
	for(let i=0; i< arr.length; i++) 
		if(arr[i] === undefined) return arr.filter(v => v !== undefined);
	return arr;
}

function _cleanData(n) {
	return arr => {
		arr = arrRemUndef(arr);
		if(n !== arr.length) {
			if(n > arr.length) {
				arr = arr.slice(0);
				while(arr.length < n) arr.push('');
			} else {
	            if(n === arr.length) return arr;
				if(n < arr.length) return arr.slice(0,n);
			}
		}
		return hasNoEmptyElem(arr, undefined);
	}
}


