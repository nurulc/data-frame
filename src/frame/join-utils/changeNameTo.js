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
 * changeNameTo takes a change name description array of two elements containing the old names and the new names
 * e.g oldName=newName 'a name change descriptor' where '=' is the seperator
 * return an array of 2 strings [oldName, newName]
 * @param  {string} name old name to new name descriptor, 'OLD=NEW'
 * @param  {string} sep  string that seperates the old name from the new
 * @return {[oldName, newName]}      and ar
 */
export default function changeNameTo(name, sep) {
	 let res = name.split(sep);
	 if( res.length === 1) res.push(name);
	 return res;
}

