//test-patutils.js

/*
var mapper = { 'x': (s) => !s || s>='0' && s <= '9',
               'z': (s) => s>='0' && s <= '9',
               'gen': function(s) {
                       if( this[s] ) return this[s];
                       this[s] = (str) => !!str && s.indexOf(str[0]) != -1;
                       return this[s]
               }
             };
*/

/*
 Some tests
*/

if(false) {
  var str = '123.[0,1,2].xz';
  console.log(getIndex( str) ); // expect [ [ '123.', 4, '[0,1,2]' ], [ '.', 12, 'x' ], [ '', 13, 'z' ] ]
  console.log(str.match(__reForDXandPX)) // expect [ '[0,1,2]', 'x', 'z' ]
}
/*

### Helper code to do unit testing

* list.all(value)  _Returns true if all element of the list are value v

*/

if( false ) {
Array.prototype.all = function(v) { return this.findIndex( x =>  x != v) === -1;};

// test
[ [true,true,true].all(true),
  [true,true,false].all(true) === false,
  [true,false,true].all(true) === false,
  [false,true,true].all(true) === false,

  [false,false,false].all(false),
  [false,true,false].all(false) === false,
  [true,false,false].all(false) === false,
  [false,false,true].all(false) === false].all(true)
}




/*
### Test the matcherFor(str) => matched func

* matcherFor(str) - _this will return a function that matches the set defined by the string_
* further it build a cache of the function so that only one copy is produced
*

*/

if( false ){
  var testFn = matcherFor('[1,4,6]');

  console.log("testFn = matcherFor('[1,4,6]')");
  console.log( 'testFn("0")=' + testFn("0"),' testFn("1")=' + testFn("1"),'testFn("2")=' + testFn("2"),'testFn("6")=' + testFn("6") );

  console.log("123aaa123bbb".indexOf("123", 1));
  [matcherFor('[1,2,4,5]')('1')==true, matcherFor('[1,2,4,5]')('2')==true,
   matcherFor('[1,2,4,5]')('3')==false,matcherFor('[1,2,4,5]')('4')==true,
   matcherFor('[1,2,4,5]')('5')==true,matcherFor('[1,2,4,5]')('6')==false,
   matcherFor('z')('0')==true,matcherFor('z')('1')==true,matcherFor('z')('9')==true,
   matcherFor('z')('')==false,matcherFor('z')('.')==false,matcherFor('z')('b')==false,
   matcherFor('x')('0')==true,matcherFor('x')('.')==true,matcherFor('x')('c')==true,
   matcherFor('x')('')==false,matcherFor('x')(null)==false]
      .all(true)
}


//=============



// TEST

if(false ) {
  JSON.stringify(node([ 'be', 'is', 'not', 'or', 'question', 'that', 'the', 'to' ]))


  /*
  Some other testst

  */

  var myStr = '123.[1,2,3]';
  function m(c) {
    return (str) => str.indexOf(c);
  }

  var re = /\[[^\]]*\]|x|z/g;


  console.log(myStr.match(re));
  console.log(re);

  var X = m('x');
  var L = m('[');
  var R = m(']');
  var Z = m('z');


  console.log(X('123.x'));
  console.log(L('123.[1,2,3]'));
}