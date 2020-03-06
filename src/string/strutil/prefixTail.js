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

import prefixLen from './prefixLen';
/**
 * Gets the non-prefix string of 'a' and 'n', for example a = 'asset', b = 'assess', the return will be ['t', 'ss']
 * @param  {String} a [description]
 * @param  {String} b [description]
 * @return {[string]}   the non-common parts of  a and b, the part after the common prefix
 */
export default  function prefixTail(a,b) {
	let pre = prefixLen(a,b);
	return [a,b].map(x => x.substr(pre));
}
