//index.js

export * from './frame'; // innerJoin,fullInnerJoin, leftJoin

export {csvLine, tsvLine} from './string/csv'; 
export {newArray} from './array/arrayutils'; 
export {flatten} from './array/flatten'; 
import _ap from './array/prod'; 

export const arrProd = _ap;
//export * from './utils';
