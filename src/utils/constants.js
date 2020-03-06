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

import memoize from './objutils/memoize';

export const EMPTY_ARRAY = Object.freeze([]);
export const EMPTY_STR = '';
export const ZERO_STR = '0';
export const ZERO_DECIMAL = '0.0';
export const SEPARATOR_STRING = ', ';



export const TRUE = () => true; // a function that always retursn true
export const FALSE = () => false; // a function that always retursn false
export const K = memoize(k => () => k); // a function that always constant value k

export const NOT = (f) => (...args) => !f(...args);
export const AND = (f1, f2) => (...args) => f1(...args) && f2(...args);
export const OR = (f1, f2) => (...args) => f1(...args) || f2(...args);