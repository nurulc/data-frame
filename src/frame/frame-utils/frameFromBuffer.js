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

import coreFrameFromBuffer from './coreFrameFromBuffer';
import {Frame} from '../frame';
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
export default function frameFromBuffer(buffer,splitter,options={})  {
     return coreFrameFromBuffer(buffer,splitter, Object.assign({Fr:Frame}, options));
}

