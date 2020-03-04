
/**
 * [description]
 * @param  {function} cmp sort comparison function
 * @return {function}      new function what will do a reverse sort
 */
export default  (cmp) => (a,b) => cmp(b,a);




