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

import isEmpty from '../../utils/types/isEmpty';
import {arrDedup } from '../../array';
import accStr from './accStr';

/**
 * gbVal merge the values grouped rows onto a single comma seperated value
 * @param  {[type]} newName [description]
 * @param  {[type]} value     [description]
 * @return {[type]}         [description]
 */
export default function gbVal(newName,value) {
	newName = newName || '';
	function getVal() {
		return [value, 0];
	}
	return [getVal,undefined,[() => value,0],newName];
}

