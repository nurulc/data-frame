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

// =============== shallow equality ===================
export default function shallow(a, b, compare) {
	var aIsNull = a === null;
	var bIsNull = b === null;

	if (aIsNull !== bIsNull) return false;

	var aIsArray = Array.isArray(a);
	var bIsArray = Array.isArray(b);

	if (aIsArray !== bIsArray) return false;

	var aTypeof = typeof a;
	var bTypeof = typeof b;

	if (aTypeof !== bTypeof) return false;
	if (flat(aTypeof)) return compare ? compare(a, b) : a === b;

	return aIsArray ? shallowArray(a, b, compare) : shallowObject(a, b, compare);
}

function shallowArray(a, b, compare) {
	var l = a.length;
	if (l !== b.length) return false;

	if (compare) {
		for (let i = 0; i < l; i++)
			if (!compare(a[i], b[i])) return false;
	} else {
		for (let i = 0; i < l; i++) {
			if (a[i] !== b[i]) return false;
		}
	}

	return true;
}

function shallowObject(a, b, compare) {
	var ka = 0;
	var kb = 0;

	if (compare) {
		for (var key in a) {
			if (
				a.hasOwnProperty(key) &&
        		!compare(a[key], b[key])
			) return false;

			ka++;
		}
	} else {
		for (let key in a) {
			if (a.hasOwnProperty(key) && a[key] !== b[key] ) return false;
			ka++;
		}
	}

	for (let key in b) {
		if (b.hasOwnProperty(key)) kb++;
	}

	return ka === kb;
}

function flat(type) { return (type !== 'function' && type !== 'object'); }

