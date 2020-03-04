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