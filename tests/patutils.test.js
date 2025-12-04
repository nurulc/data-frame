
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

import { parseCodePat, getPrefixFromComp, getPrefixStr                        } from '../src/utils/patutils'; 
//import { expect} from "chai"; 
//import {DONE,MORE,MAYBE,FAILED} from '../regexp-parser';
let log = console.log.bind(console);


describe('Test parseCodePat', () => { 

//    describe("simple parsePat code", () =>{
// Example of use from the test cases
//
	//log(parseCodePat('c[1,2,3].5'));
	it('parses simple pattern \'\'', () =>{
		expect(parseCodePat('')).toEqual([ [ '', 0, '' ] ]);      
	}); 
	it('parses simple pattern \'cat\', \'1234\' \'12.34', () =>{
		expect(parseCodePat('cat')).toEqual([ [ 'cat', 3, '' ] ]);      
		expect(parseCodePat('1234')).toEqual([ [ '1234', 4, '' ] ]); 
		expect(parseCodePat('12.34')).toEqual([ [ '12', 2, '.' ],['34',5,''] ]);      
	}); 
	it('parses simple pattern c[1,2,3].5', () =>{
		expect(parseCodePat('c[1,2,3].5')).toEqual([ [ 'c', 1, '[1,2,3]' ], [ '', 8, '.' ], [ '5', 10, '' ] ]);
		expect(parseCodePat('c[1,2,3].xx')).toEqual([ [ 'c', 1, '[1,2,3]' ], [ '', 8, '.' ], [ '', 9, 'x' ],['',10, 'x'],['',11,''] ]);
	});
	it('parses simple pattern c[1,23].5. to throw error', () =>{
		expect(() => parseCodePat('c[1,23].5')).toThrow(Error);               
	});
	it('parses simple pattern c[1,2,x].x to throw error', () =>{
		expect(() => parseCodePat('c[1,23].5')).toThrow(Error);               
	});
	it('parses simple pattern c[1:3].xx', () =>{
		expect(parseCodePat('c[1:3].xx')).toEqual([ [ 'c', 1, '[1:3]' ], [ '', 6, '.' ], [ '', 7, 'x' ],['',8, 'x'],['',9,''] ]);
	});
	it('Throw range error for pattern c[4:3].xx, since 4>3', () =>{
		//console.log(parseCodePat('c[4:3].xx'));
		expect(() => parseCodePat('c[4:3].xx')).toThrow(Error);
                
	});
    
});

