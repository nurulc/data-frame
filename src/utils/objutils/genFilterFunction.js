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

import {TRUE} from '../constants';
/**
 * create a function that tests for elements in aListOrStringOrEmpty
 *   aListOrStringOrEmpty => undefined - allows everything
 *   aListOrStringOrEmpty => [... names ] - allow only the elelemnts in the list 
 *   aListOrStringOrEmpty => <single string Name> (string) - allow only single name 
 * @param  {[type]}
 * @return {[type]}
 */
export default function genFilterFunction(aListOrStringOrEmpty) {
	if(aListOrStringOrEmpty === undefined) return TRUE;
	if(typeof aListOrStringOrEmpty === 'string') return (v => v === aListOrStringOrEmpty); // single name filter
	if(Array.isArray(aListOrStringOrEmpty)) return (v => aListOrStringOrEmpty.indexOf(v) !== -1); // matches a list
	throw new Error('Unexpected type - expected endefined, a string, or and array of string');
}

