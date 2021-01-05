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
//
//
function UNDEFINED() { return undefined; }

/**
 * Create a groupBy accumulator function, 
 * an example of the function is as follows (counts the number of non-emply cells is agroup) 
 *
 * ```
 *  function fn(action,accum,count, val) { // example of a grouping function
 *   if( accum === undefined ) accum = 0;  // initialization of accumulator
 *   if( action !==1 ) return [count,count]; // compute final value for the accumulator
 *   return isEmpty(val)	?
 *   		[accum,count] :    				// no change sine vale of cell is empty
 *   		[accum+1,count+1];				// count the number of non-empty values 
 *  }
 *
 * const gbCount = 
 *
 * ```
 *
 * 
 * @param  {Function} fn      an accumolation function
 * @param  {Function} initFn  optional initialization function
 * @param  {[type]}   initVal [description]
 */
export default function gbMake(fn, initFn=UNDEFINED, iniCount=0) {
  return (name,newName) => {
  newName = newName || name;
  return [fn,name,[initFn, iniCount ] ,newName];
  }
}

//we should later add gbMode (most occuring value), gbMedian (middle value)
