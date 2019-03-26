// lens implement powefule way to manipulate objects in a functional way
// 
// see: https://medium.com/@dtipson/functional-lenses-d1aba9e52254
//      https://gist.github.com/branneman/f06bd451f74e5bc1725db23be682d4fe
//      
//  Overview:
//    Just like lenses in a microscope, a functional lens allows you to focus in to 
//    a samll part of a larger data structure, the functionality may seem trivial but it is actually far from trivial
//    
//    A lens allows you to change data deep inside an object structure without modifying the object, 
//    but get an a complete copy of the original but with modifications requested using the lens.
//    
//        see exmaple below:    


//simple auto currying 
//(does NOT separately handle f.length == args.length or f.length < args.length cases)

export function curry(f, ...args) { 
	return (f.length <= args.length) ? f(...args) : (...more) => curry(f, ...args, ...more);
}

export function pipe(fn,...fns){ return (...args) => fns.reduce( (acc, f) => f(acc), fn(...args)); }

export const compose = (...fns) => pipe(...fns.reverse());
export const mapWith = curry((f, xs) => xs.map(f));

const composeL = (fns) => pipe(...fns.slice(0).reverse());
const _prop = curry((key, obj) => (obj!==undefined && key !== undefined)?obj[key]:undefined);

const assoc = curry((key, val,obj) => {
	let res;
	if( key === undefined) return obj;
	else if( obj === undefined ) {
		return obj;
	}
	else if( Array.isArray(obj) ) {
		res = obj.slice(0);
		res[key] = val;
	}
	else if(typeof obj !== 'object') return obj;
	else res = Object.assign({}, obj, {[key]:val});
	return res;
});

function _assocL(list,ix) {
	if(list.length <= ix+1) return assoc(list[ix]);
	let k = list[ix]; 
	return (val,obj) => assoc(k, _assocL(list,ix+1)(val, _prop(k,obj)), obj);
}

/**
 *  LENS capability for JavaScript, powerful tool for manipulating objects and arrays immutably
 */

// FP Lenses
export const lens = curry((get, set) => ({ get, set })); // low low level lens creation

export const view = curry((lens, obj) => lens.get(obj));
export const set = curry((lens, val, obj) => lens.set(val, obj));
export const over = curry((lens, fn, obj) => set(lens, fn(view(lens, obj)), obj));

// Lens creation function
export const prop = key => lens(_prop(key),assoc(key));
export const path = (...xs) => xs.length === 1 ? prop(xs[0]) : lens(composeL(xs.slice(0).reverse().map(k => _prop(k))), _assocL(xs, 0));

// Generic FP utils
export 	const map = curry( (fn, list) => list.map(fn) );
export 	const filter = curry( (fn, list) => list.filter(fn) );
	 	const lt = curry( (left, right) => left < right );
	 	const add = curry( (left, right) => left + right );
		const upper = str => str.toUpperCase();
export default {view, set, over, path};



/*

// ** Example usage: Object

//const amountLens = lens(_prop('amount'))(assoc('amount')); // or prop('amount')

const amountLens = path('amount');
set(amountLens,5)({ x: 1, amount: 10 });
//=> { x: 1, amount: 5 }

over(amountLens)(add(5))({ x: 1, amount: 10 });
//=> { x: 1, amount: 15 }


//  *** Example usage: Array

const headLens = path(0)
over(headLens)(upper)(['first', 'second']);
//=> [ 'FIRST', 'second' ]


// using path lens:

const toValue = path( 'amount', 'value'); 
let myData = { x: "value for X",  amount: { value: 10 }  };
over(toValue, add(10))(myData);
// => { x: 'value for X', amount: { value: 20 } }
//
// note myData remains unchanged

// *** Using array path

let myArray=[0, [0,1,2,3], 4, 5];

let toIX = path( 1, 3 );
set(toIX)(33,myArray);
// => [ 0, [ 0, 1, 2, 33 ], 4, 5 ]



console.log(myData);
// => { x: "value for X",  amount: { value: 10 }  }


// * Example usage: Chaining
 
const moneyLens = path('money');
const data = [{ money: 42 }, { money: 1024 }, { money: 1337 }];
compose(
  map(over(moneyLens)(add('€ '))),
  filter(compose(lt(100), view(moneyLens)))
)(data);
//=> [ { money: '€ 1024' }, { money: '€ 1337' } ]


var myArrayN =  { fred: { array: [0, ["0",1,2,3], 4, 5], another: 1} , mary: 'hello'};
var toIX3 = path('fred', 'array',    1,       3);

var modify = over(toIX3, add("!@# - ")); // creates a function to modify the "myArrayN.fred.array[1][3]"
var result = modify( myArrayN );		 // note the modify function does not change myArrayN

[JSON.stringify(result), JSON.stringify(myArrayN)]
// => [ '{"fred":{"array":[0,["0",1,2,"!@# - 3"],4,5],"another":1},"mary":"hello"}',
//      '{"fred":{"array":[0,["0",1,2,3],4,5],"another":1},"mary":"hello"}' ]

// Example usage: Composition

const article = { title: 'FP ftw!', comments: [{ t: 'boo!' }, { t: 'yay!' }] };
over(prop('comments'), map(over(prop('t'), upper)))(article);
//=> { title: 'FP ftw!', comments: [{ t: 'BOO!' }, { t: 'YAY!' }]}
*/