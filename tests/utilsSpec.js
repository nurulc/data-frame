
/*
Copyright (c) 2016, Nurul Choudhury
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


/*

export function isEmpty(arrOrObj) {
export function newArray(n,v) { // seems to be faster way to create an array
export function last(arr,defaultV='') {
export function arrOf(aVal,n) {
export function arrHash(arr) {
export function arrRemove(arr, listToRemove) {
export function arrSplit(n,arr) {
export function arrZip(...arrays) {
export function arrConcat(...arrays) {
export function arrDiff(arr1, arr2) {
export function arrUnion(arr1, arr2) {
export function arrIntersect(arr1, arr2) {
export function xor(array1, array2) {
export function redim(arr, n) {
export function vecAdd(a1,a2) {
export function safeDedup(list) {
export const arrDedup 
export const arrSum 
export const arrMin 
export const arrMax 
export const arrCount 
export const arrMean
export function arrEqual(arr1, arr2) {
export function arrDistinct(arr1, arr2) {
export function arrCountVal(list,v) {
export function reord(subListWithNewOrder,fullList) {
export function setHash(arrOfInt) {
export const FLATTEN = (res=[],arr) => Array.isArray(arr)?res.concat(arr):(res.push(arr), res);
export function flatten(arr, level) {
export function arrProd(...list) { 
export const arrProd2 = arrProd; 
export function zipToDict(aListOfPairs) {
export function dictToZipB(aDict) {
export function dictToZip(aDict) {
export function filterIX(fn,arr) {
*/


import * as a from "../src/array/arrayutils"; 
import { expect} from "chai"; 
//import {DONE,MORE,MAYBE,FAILED} from '../regexp-parser';
let log = console.log.bind(console);


describe("arrayutils", () => { 

    describe("basic functions", () =>{
/*

*/
        //log(parseCodePat('c[1,2,3].5'));
        it("simple pattern ''", () =>{
          expect(parseCodePat('')).to.be.deep.equal([ [ '', 0, '' ] ]);      
        }); 
        it("simple pattern 'cat', '1234' '12.34", () =>{
          expect(parseCodePat('cat')).to.be.deep.equal([ [ 'cat', 3, '' ] ]);      
          expect(parseCodePat('1234')).to.be.deep.equal([ [ '1234', 4, '' ] ]); 
          expect(parseCodePat('12.34')).to.be.deep.equal([ [ '12', 2, '.' ],['34',5,''] ]);      
        }); 
        it("simple pattern c[1,2,3].5", () =>{
          expect(parseCodePat('c[1,2,3].5')).to.be.deep.equal([ [ 'c', 1, '[1,2,3]' ], [ '', 8, '.' ], [ '5', 10, '' ] ]);
          expect(parseCodePat('c[1,2,3].xx')).to.be.deep.equal([ [ 'c', 1, '[1,2,3]' ], [ '', 8, '.' ], [ '', 9, 'x' ],['',10, 'x'],['',11,''] ]);               
        });
        it("simple pattern c[1,23].5. to throw error", () =>{
          expect(() => parseCodePat('c[1,23].5')).to.throw(Error);               
        });
        it("simple pattern c[1,2,x].x to throw error", () =>{
          expect(() => parseCodePat('c[1,23].5')).to.throw(Error);               
        });
        it("simple pattern c[1:3].xx", () =>{
          expect(parseCodePat('c[1:3].xx')).to.be.deep.equal([ [ 'c', 1, '[1:3]' ], [ '', 6, '.' ], [ '', 7, 'x' ],['',8, 'x'],['',9,''] ]);               
        });
        it("Throw range error for pattern c[4:3].xx, since 4>3", () =>{
          //console.log(parseCodePat('c[4:3].xx'));
          expect(() => parseCodePat('c[4:3].xx')).to.throw(Error);
                
        });
    }); 
});

