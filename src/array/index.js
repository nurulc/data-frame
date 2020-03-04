export * from './arrayutils';
export * from './intset';
export * from './prod';
export * from './flatten';
import _ap from './prod';
import _r from './reord';
import _arrEQ from './arrEQ';
import _arrCMP from './arrCMP';
export const reord = _r, 
 			 arrProd=_ap,
 			 arrEQ = _arrEQ,
 			 arrCMP = _arrCMP;