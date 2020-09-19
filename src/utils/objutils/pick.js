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

import memoize from './memoize';
import pickRaw from './pickRaw'
/**
 * Returns a function that extract elements of an object, or from a list of elements
 * 	pick(key) => returns a function that takes an object and returns an elemnt 
 *  pick(keyList) => returns a function that takes an object and returns an array of element values
 *
 *  The pick function is memoized to make it memory efficient
 *
 *  example:
 *    `let nameAddress = pick('name', 'street');`
 *    `let obj = { name: 'Andrew', street: '1 Pine Street', city: 'New York', state: 'NY', zip: '10004' }`
 *    `nameAddress(obj)`  returns `['Andrew', '1 Pine Street']`
 *
 * @param  {String} list   String or array of strings
 * @return {function}      function that takes an object and returns the key or an array of keys
 */
export default  memoize(pickRaw);

