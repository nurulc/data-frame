/*

Define a bunch of utilities

 ===== METADATA RULE REDUCER ========= (745)
 Frame utils:  readFrame, readZipFrame, writeFrame, writeStreamFrameP, writeFrameOnStream

 metadata: readMetadata,readMDLib, writeMDFile

 helpers: MATCH(val|Array|Set|func) => matching_func
          FILTER(fn) => function that will filter and array or Frame

          SOME, PICK(name), pipe(fn,f2,fn3)
*/


var PATH = '../';
var dfr = require(`${PATH}./lib`);

// var scu = require(PATH+'../script-utils')
var {NOT,OR,AND, K, TRUE, FALSE} = fn_u;



var TEST_NEW = true;

var {Frame, range, newArray,  csvLine, tsvLine, psvLine, Frame, flatten,
     zipToDict, flatten,arrConcat,addDedup, tsvLine, csvLine
 
    }  = frame.Frame;
var fs = require('fs');
var zlib = require('zlib');
var { Readable } = require('stream');
var log = (a, msg) => { console.log(msg, a); return a; };



// =================================================

function genTSV(arr) {
  return arr.join('\t');
}




function isString(obj) {
  return typeof obj === 'string';
}

function Identity(a) { return a; }


function tee(x, msg) { console.log(x, msg || ''); return x; }
function timeIt(count, fn, name = 'func') {
  const t0 = new Date().getTime();
  let res;
  for (let i = 0; i < count; i++) {
    res = fn();
  }
  const t1 = new Date().getTime();
  console.log(`Call to ${name} took ${t1 - t0} milliseconds.`);
  return res;
}

function timeOf(fn) {
  const name = 'func';
  const t0 = new Date().getTime();

  const res = fn();

  const t1 = new Date().getTime();
  console.log(`Call to ${name} took ${t1 - t0} milliseconds.`);
  return res;
}
function keys(dict) { return Object.keys(dict); }
function log(x, msg) { console.log(x, msg || ''); return x; }

function show_bytes_read(data) {
  log(data.length / (1024 * 1024), 'MB read');
}


// NOTE EXPORTS ARE AT THE BOTTOM
//

function round(v) { return isNaN(+v) ? '' : Math.round(v * 10000.0) / 10000.0; }
function round2(v) { return isNaN(+v) ? '' : Math.round(v * 100.0) / 100.0; }


// ========== utilities to read and write Frames ==================

// takes a filter - that converts a single string to an array of strings
// example of a filter  'tsvLine', converts string with tab seperated columns into an array of strings
//
// this takes a filter => filter,
//
// the returned filter make sure that in the array id two strings are the same, they point to the same memory


function convertFilter(filter, ignore) {
  if (ignore) return filter;
  const _map = new Map();
  function C(s) {
    const _s = _map.get(s);
    if (_s !== undefined) return _s;
    _map.set(s, s);
    return s;
  }
  return function (str) {
    const arr = filter(str);
    if (arr === undefined || arr.length === 0) return arr;
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      const s = arr[i];
      if (typeof s === 'string') {
        arr[i] = C(s);
      }
    }
    return arr;
  };
}

// ======== a class

var Li = class {
  constructor(str) {
    this.ix = 0;
    this.pos = 0;
    this.str = str;
  }
  /**
     * [reset description]
     * @return {[type]} [description]
     */
  reset() { this.ix = this.pos = 0; return this; }

  _next() {
    if (this.pos === -1) return undefined;
    let p = this.pos;
    const str = this.str;
    const len = str.length;
    while (p < len) {
      const c = str[p++];
      if (c === '\r') {
        if (p < len && str[p] === '\n') {
          const s = str.substring(this.pos, p - 1);
          this.pos = p + 1;
          this.ix++;
          return s;
        }
        const s = str.substring(this.pos, p - 1);
        this.pos = p;
        this.ix++;
        return s;
      } else if (c === '\n') {
        const s = str.substring(this.pos, p - 1);
        this.pos = p;
        this.ix++;
        return s;
      }
    }
    const s = str.substr(this.pos);
    this.pos = -1;
    if (!s) return undefined;
    this.ix++;
    return s;
  }
  /**
     * [mapLine description]
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
  mapLineStr(fn) {
    let data;
    const res = [];
    let pos = this.pos,
      ix = this.ix;
    for (let i = ix + 1; (data = this._next()) !== undefined; i++) {
      res.push(fn(data, i));
    }
    this.pos = pos;
    this.ix = ix;
    return res;
  }

  /**
     * [mapLineIX description]
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
  mapLine(count, fn) {
    if (typeof count === 'function') {
      fn = count;
      count = 2000000;
    }
    let ix = this.ix;
    let pos = 0,
      len = this.str.length;
    const str = this.str;
    const res = [];
    for (let i = 0; ix < len && i < count; i++) {
      while (ix < len && str[ix] !== '\n') ix++;
      ix++;
      if (ix < len) res.push(fn(str, (pos = ix), i));
    }
    this.pos = pos;
    this.ix = ix;
    return res;
  }
  /**
     * [filterLine description]
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
  filterLine(fn) {
    let data;
    const res = [];
    let pos = this.pos,
      ix = this.ix;
    for (let i = ix + 1; (data = this._next()) !== undefined; i++) {
      if (fn(data, i))res.push(data);
    }
    this.pos = pos;
    this.ix = ix;
    return res;
  }
};


function writeFrameSync(fileName, frame, joiner = genTSV) {
  let lines = frame.data,
    len = frame.length;
  const i = 0;
  let sLines = lines.map(joiner).join('\n');
  sLines = `${joiner(frame.columns)}\n${sLines}`;
  fs.writeFileSync(fileName, sLines);
}


function readFrame(fileName, filter, noDedup) {
  filter = convertFilter((filter || tsvLine), noDedup);
  const data = fs.readFileSync(fileName, 'utf8'); // Read from file
  // log("bytes read", data.length)

  const dataDetail = new Li(data).mapLineStr(filter);
  // log("Lines: ", dataDetail.length);

  const columns = dataDetail.splice(0, 1)[0];
  return (new Frame(dataDetail, columns));
}

function readZipFrame(fileName, filter, noDedup) {
  filter = convertFilter((filter || tsvLine), noDedup);

  const buffer = readZipData(fileName); // Read from file
  // console.log("bytes read", buffer.length)
  const dataDetail = new Li(buffer.toString('ascii')).mapLineStr(filter);
  // console.log("Lines: ", dataDetail.length);
  const columns = dataDetail.splice(0, 1)[0];
  const res = (new Frame(dataDetail, columns));
  // console.log("LEN:", res.length);
  return res;
}

function writeFrame(fileName, frame, joiner, success, error) {
  const stream = fs.createWriteStream(fileName, { flags: 'w' });
  if (!joiner) joiner = data => data.join('\t');
  writeFrameOnStream(stream, frame, joiner, success, error);
}

function writeStreamFrameP(stream, frame, joiner) {
  return new Promise((resolve, error) => {
    writeFrameOnStream(stream, frame, joiner, resolve, error);
  });
}

function writeFrameOnStream(stream, frame, joiner, success, error) {
  if (!joiner) { throw new Error(`Line formatting function is required: ${joiner}`); }


  let lines = frame.data,
    len = frame.length;
  let i = 0;
  stream.write(joiner(frame.columns), 'utf8');
  writeBuff();

  stream.on('drain', writeBuff);
  if (success) stream.on('end', success);
  if (error) stream.on('error', error);


  function writeBuff() {
    let s = [];
    try {
      for (; i < len;) {
        s = lines[i++] || [];
        const written = stream.write(`\n${joiner(s)}`, 'utf8'); // <-- the place to test
        if (!written) return;
      }
    } catch (e) {
      console.log(e, i, s);
    }
    if (i === len) stream.end();
  }
}

// ===============================================

// ================ reading helpers ================
function readZipData(fileName) {
  const buffer = fs.readFileSync(fileName); // Read from file
  // console.log("bytes read", buffer.length)
  return zlib.gunzipSync(buffer);
}


function writeListOnStream(stream, list, success, error) {
  let lines = list,
    len = list.length;
  let i = 0;
  writeBuff();

  stream.on('drain', writeBuff);
  if (success) stream.on('end', success);
  if (error) stream.on('error', error);


  function writeBuff() {
    let s = '';
    try {
      for (; i < len;) {
        s = lines[i++];
        const written = stream.write(s, 'utf8'); // <-- the place to test
        if (!written) return;
      }
    } catch (e) {
      console.log(e, i, s);
    }
    if (i === len) stream.end();
  }
}

// ===============================================
// ================ reading/write JSON ===========


function readJson(fileName) {
  try {
    const data = fs.readFileSync(fileName, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return undefined;
  }
}

function writeJson(fileName, obj) {
  const s = JSON.stringify(obj, null, ' ');
  fs.writeFileSync(fileName, s);
}

// ===============================================
// =============== HTML HELPER ===================
const htmlGen = function () {
  function mapper(name) {
    switch (name) {
      case 'className': return 'class';
    }
    return name;
  }
  function _toStr(val, opts) {
    if (val == undefined) return '';
    else if (typeof val === 'function') return _toStr(val(opts), opts);
    else if (Array.isArray(val)) return val.map(v => v.toStr(v, opts)).join('');
    return val.toString();
  }

  function optsToStr(opts) {
    if (opts === undefined) return '';
    if (typeof opts === 'string') return opts;
    const keys = Object.keys(opts);
    let s = keys.map(k => `${mapper(k)}="${opts[k]}${'"'.join(' ')}`);
    if (s.length > 0) s = ` ${s} `;
    return s;
  }

  function htmlTag(tagName) {
    return function (opts, ...values) {
      const xopts = { parentOpts: opts, parent: tagName, siblings: values };
      const strValues = values.map(v => _toStr(v, xopts));
      if (strValues.length === 0) return `<${tagName}${optsToStr(opts)} />`;
      return `<${tagName}${optsToStr(opts)}>${
        strValues.join('\n')
      }<${tagName}/>`;
    };
  }
  const res = zipToDict(['TABLE', 'TR', 'TD', 'THEAD', 'TBODY', 'TH'].map(tag => [tag, htmlTag(tag.toLowerCase())]));
  function HEADER(opts, names) {
    return res.THEAD(opts, res.TR(opts, ...names.map(n => res.TH(opts, n))));
  }
  function ROWS(opts, ...rows) {
    return res.TBODY(opts, ...rows);
  }
  function ROW(opts, ...cells) {
    return res.TR(opts, ...cells.map(v => res.TD(opts, v)));
  }
  return Object.assign(res, { HEADER, ROW, ROWS });
};
Object.assign(global, htmlGen());

function objToHtml(obj, keys) {
  if (obj === undefined) return 'undefined';
  if (typeof obj._toHtml === 'function') return obj._toHtml();
  keys = keys || Object.keys(obj);
  return TABLE({}, HEADER({}, keys), ROWS({}, ROW({}, ...keys.map(k => obj[k].toString()))));
}




var initFunctions = '/readFrame, readZipData, readJson, readMetadata, readMdLib, ' +
    'round, isString, tee, timeIt, timeOf, keys, log,  show_bytes_read';


// function MATCH(valArrOrSet) {
//     if(typeof return valArrOrSet === 'function') return valArrOrSet;
//     if( valArrOrSet instanceof Set ) return (v => valArrOrSet.has(v));
//     if( Array.isArray(valArrOrSet) ) return (v => valArrOrSet.indexOf(v) !== -1);
//     return (v => v == valArrOrSet);
// }

function MATCH(valArrOrSet) {
  if (typeof valArrOrSet === 'function') return valArrOrSet;
  if (valArrOrSet instanceof Set) return (v => valArrOrSet.has(v));
  if (Array.isArray(valArrOrSet)) return (v => valArrOrSet.indexOf(v) !== -1);
  return (v => v == valArrOrSet);
}

function SOME(fn) {
  return (arr => (arr ? (Array.isArray(ar) ? arr.some(fn) : fn(arr)) : false));
}

function FILTER(fn) {
  return (
    (arr) => {
      if (Array.isArray(arr)) return arr.filter(fn);
      if (arr instanceof Frame) return arr.filter(fn);
      return fn(arr);
    }
  );
}

function PICK(nameOrArrayOfNames) {
  if (isString(nameOrArrayOfNames)) return (obj => (obj ? obj[nameOrArrayOfNames] : obj));
  if (Array.isArray(nameOrArrayOfNames) && nameOrArrayOfNames.every(isString)) { 
      return obj => (obj ? nameOrArrayOfNames.map(name => obj[name]) : obj); 
  }
}

function isString(s) { return typeof s === 'string'; }

function pipe(...args) {
  switch (args.length) {
    case 0: return v => v;
    case 1: return (...v) => args[0](...v);
    case 2: return (...v) => args[1](args[0](...v));
    case 3: return (...v) => args[2](args[1](args[0](...v)));
    case 4: return (...v) => args[3](args[2](args[1](args[0](...v))));
    case 5: return (...v) => args[4](args[3](args[2](args[1](args[0](...v)))));
    //default: return (...v) => args.slice(1).reduce((res, f) => f(res), args[0](...v));
  }
}

function isCodesKey(key) {
  if (key === 'codes') return true;
  else if (key.match(/^<[^>]+>$/)) return true;
  return false;
}


var { cmpStrNum, combineCmp, revCmp } = fh;
var CC = (a, b) => { const res = cmpStrNum(a, b); console.log('CC', a, b, res); return res; };
var cmpNumOrStrBy = getData => (row1, row2) => cmpStrNum(getData(row1), getData(row2));
// var cmpNumOrStrBy =  (getData) => (row1,row2) => CC(getData(row1),getData(row2));

//var strDiff = require(`${PATH}lib/string/strdiff`).default;
var StrDiff = class {
  constructor(str1, str2, cursor) {
    this.from = str2;
    this.to = str1;
    this.res = strDiff(str2, str1, cursor);
  }
  _toHtml() {
    return this.res.map(span).join('');
    function span([action, str]) {
      if (str.match(/[&<>]/)) {
        str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      switch (action) {
        case strDiff.DELETE: return `<span style="text-decoration: line-through; color: red">${str}</span>`;
        case strDiff.INSERT: return `<span style="text-decoration: underline; color: green">${str}</span>`;
        default: return str;
      }
    }
  }
};

// add 2 vectors
function vecAdd(a1, a2) {
  if (a1 === undefined) {
    if (Array.isArray(a2)) return a2.slice();
    return undefined;
  } else if (a2 === undefined) {
    if (Array.isArray(a1)) return a1.slice();
    return undefined;
  }
  if (a1.length < a2.length) {
    return a2.map((v, i) => v + (a1[i] || 0));
  }
  return a1.map((v, i) => v + (a2[i] || 0));
}

function isString(s) {
  return (typeof s === 'string');
}

function scmp(a, b) {
  if (a === b) return 0;
  if (a === undefined) return -1;
  if (b === undefined) return 1;
  return a.localeCompare(b);
}

function arrDiffStr(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return undefined;
  if (arr1.every(isString) && arr2.every(isString)) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const res1 = arr1.map((val, ix) => (set2.has(val) ? undefined : [ix, 1, val])).filter(x => !!x);
    const res2 = arr2.map((val, ix) => (set1.has(val) ? undefined : [ix, 2, val])).filter(x => !!x);
    return [...res1, ...res2].sort((a, b) => a[0] - b[0]);
  }
  return undefined;
}

function isArray(arr) {
  if (!arr) return undefined;
  return (arr.constructor === Array) ? arr : undefined;
}

function arrDiff(arr1, arr2) {
  const array = {};
  if (!isArray(arr1) || !isArray(arr2)) {
    throw new TypeError('Invalid argument, Please pass proper array argument');
  }

  const result = [];
  for (let i = 0; i < arr2.length; i++) {
    array[arr2[i].join('\t')] = arr2[i];
  }

  for (let i = 0; i < arr1.length; i++) {
    if (array[arr1[i].join('\t')] === undefined) { result.push(arr1[i]); }
  }
  return result;
}


/**
* Show the changes to arr1 to convert it to arr2,
* REMOVE: '-'  item in arr1 is not in arr2,
* ADD: '+' item in arr2 is not in arr1
* KEEP: '' item is in both arrays
* assumes two sorted arrays,
*
* usage: getArrMods(['01',     '03','04',     '06',               '10','11'],
*                   ['01','02','03',     '05',     '07','08','09',          '12','13'])
*
* result:
* [[ '',  '01' ], <- same
*  [ '+', '02' ],
*  [ '',  '03' ], <- sames
*  [ '-', '04' ],
*  [ '+', '05' ],
*  [ '-', '06' ],
*  [ '+', '07' ],
*  [ '+', '08' ],
*  [ '+', '09' ],
*  [ '-', '10' ],
*  [ '-', '11' ],
*  [ '+', '12' ],
*  [ '+', '13' ] ]
*
*/
function getArrMods(arr1, arr2) {
  let len1 = arr1.length,
    len2 = arr2.length;
  const REM = '-',
    ADD = '+',
    SAME = '';
  let i = 0,
    j = 0;
  const res = [];
  for (; i < len1 && j < len2;) {
    let v1 = arr1[i],
      v2 = arr2[j];
    const cv = cmpStrNum(v1, v2);
    if (cv < 0) { res.push([REM, v1]); i++; } else if (cv === 0) { res.push([SAME, v1]); i++; j++; } else {
      res.push([ADD, v2]); j++;
    }
  }
  while (i < len1) res.push([REM, arr1[i++]]);
  while (j < len2) res.push([ADD, arr2[j++]]);
  return res;
}

// $$.html(`
// <script>
//     window.exports = {};
//     window.module = {};
// </script>`);

var docs = `
// var fs = require("fs");
// var su = require('./lib/string/strutil');
// var au = require('./lib/array/arrayutils');
// var pu = require('./lib/utils/patutils');
// var mu = require('./lib/metadata/matcher');
// var sc = require("./lib/metadata/searchcode")
// var iset = require('./lib/array/intset');
// var md = require('./lib/metadata/metadata');
// var frame = require('./lib/frame/frame');
// var cl = require('./lib/claim/claim');
// var ou = require('./lib/utils/objutils');
// var csv = require('./lib/string/csv');
// //
// var fh = require('./lib/frame/framehelper');
// var cu = require('./lib/frame/colutils');
// //var //pw = require("./tests/words");
// var byline = require('byline');
// var zlib = require('zlib');
// var ssu = require('../lib-scripts/scriptUtils');
// var mdN = require('./lib/metadata/metadata_codeGroup');
// var gcx = require("./lib/metadata/buildPatternLookup")
// var {flatten, project, arrDedup, Frame, groupBy, gb, dictToZip, zipToDict, zipTo, arrProd, MultiDict} = require("../lib");

// var Frame = frame.Frame;
// var Metadata = md.Metadata;
// var {readFrame, readFrameSync, readFrameP, readDataP, loadSearchList, dedup, addDict, log, genTSV, genCSV, convertDMY, 
//      formatI9dx, formatI9px, range, getColList, getAge, has, dictToZip, zipToDict, product, 
//      zipStream, writeFrameSync, readTextP, writeFrameP, writeZipFrameP, writeFrame, 
//      writeZipFrame, writeStreamFrameP, writeFrameOnStream, readZipFrameP, memoize, 
//      pick, lpad, readDirP, readJson, writeJson, fileSize, mkdir, genQueue, round, 
//      round2, MultiDictSet, PatternCache, MultiDict, SumDict} = ssu;

// var Claim = cl.Claim;
// var [csvLine, tsvLine, psvLine] = [csv.csvLine, csv.tsvLine, csv.psvLine];
       
//var CreditTriggersNew = mdN.CreditTriggersNew;

MATCH, SOME, PICK(name), pipe(fn,f2,fn3)

`;

// ========================= FIXED COLUMN DATA SPLITTER ======================
// var l = [10,12,17];
// var s = '01234567890123456789';

function splitByCol(...colList) {
  if (colList[0] !== 0) colList = [0, ...list];

  return function (str) {
    const len = colList.length - 1;
    const res = [];
    for (let i = 0; i < len; i++) {
      let st = colList[i],
        en = colList[i + 1];
      res.push(str.substring(st, en).trim());
    }
    res.push(str.substr(colList[len]).trim());
    return res;
  };
}


// var spl = splitByCol(l);
// spl(s)
//  readFrame('colFixColFrame.txt', splitByCol(10,12,17))

// ========================= FIXED COLUMN DATA SPLITTER ======================


// ===== METADATA RULE REDUCER =========

var EMPTY_ARRAY = [];

function asArray(list) {
  let res;
  if (typeof list === 'string') res = [list.trim()];
  else if (Array.isArray(list)) res = arrDedup(flatten(list)).filter(s => s).map(s => s.trim());
  else res = [];
  const isStr = res.every(v => typeof v === 'string');
  if (!isStr) throw Error(`expected a string or a list of str but found:${list}`);
  // console.log({res})
  return res;
}



// =====================================

function setupD3() {
  // $$.html( `<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.0/d3.js"></script>`)
  const V3 = 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.0/d3.js';
  const V4 = 'https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.js';
  const V5 = 'https://d3js.org/d3.v5.min.js';
  $$.html(`
    <script>
        window.exports = {};
        window.module = true;
        //alert('1. D3 load'+window.exports);
    </script>
    <script src="${V4}"></script>
    
    <script>
         //alert('2. D3 load ');
          if(!window.d3) window.d3=window.exports;
       
        function setData(data, func) {
            setTimeout((data)=>func(data),0);
        }
    </script>`);
  console.log('D3 - loader');
}

function genID() {
  return `A${Math.trunc(Math.random() * 100000)}`;
}

function graphDraw(graph) {
  const id = genID();
  $$.html(`
    <script src="https://d3js.org/d3-collection.v1.min.js"></script>
    <script src="https://d3js.org/d3-dispatch.v1.min.js"></script>
    <script src="https://d3js.org/d3-quadtree.v1.min.js"></script>
    <script src="https://d3js.org/d3-timer.v1.min.js"></script>
    <script src="https://d3js.org/d3-force.v1.min.js"></script>
    <style>

    label {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      position: absolute;
      left: 10px;
      top: 10px;
    }

    </style>
    <canvas id="${id}" width="960" height="600"></canvas>
    <label><input id="${id}I" style="width:240px;" type="range" min="0" max="1" step="any" value="0.5"> Link Strength</label>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script>
    var d3 = exports;
    var graph = ${JSON.stringify(graph)};
    var canvas = document.querySelector("#${id}"),
        context = canvas.getContext("2d"),
        width = canvas.width,
        height = canvas.height;

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(0.5))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        // .alphaDecay(0);

    d3.select("#${id}I")
        .on("input", inputted);

    setTimeout( function() {
      simulation
          .nodes(graph.nodes)
          .on("tick", ticked);

      simulation.force("link")
          .links(graph.links);

      function ticked() {
        context.clearRect(0, 0, width, height);

        context.beginPath();
        graph.links.forEach(drawLink);
        context.strokeStyle = "#aaa";
        context.stroke();

        context.beginPath();
        graph.nodes.forEach(drawNode);
        context.fill();
        context.strokeStyle = "#fff";
        context.stroke();
      }
    },0);

    function inputted() {
      simulation.force("link").strength(+this.value);
      simulation.alpha(1).restart();
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(d) {
      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    }
</script>
`);
}

/*
    Usage: barChart([{key:'Atest', value:100}, ...]);

    data= array of {key, value}
    props {
        height: height of graph
        width: width of thr graph
        title: text of the title
        axisX: x-axis label
        axisY: y axis label

    }
*/

function barChart(data, {
  height, width, title, axisX, axisY, source,
}) {
  const sData = JSON.stringify(data);
  const id = genID();

  height = height || 600;
  width = width || 1000;
  axisX = axisX || 'Keys';
  axisY = axisY || 'Values';
  source = source || '';
  const values = data.map(d => d.value);
  const maxV = au.arrMax(values);
  const minV = au.arrMin(values);
  $$.html(`
    <style>
    div#${id}barlayout {
      text-align: center;
    }

    div#${id} {
      width: 1000px;
      height: 600px;
      margin: auto;
      background-color: #2F4A6D;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    .${id}bar {
      fill: #80cbc4;
    }

    text {
      font-size: 12px;
      fill: #fff;
    }

    path {
      stroke: gray;
    }

    line {
      stroke: gray;
    }

    line#${id}limit {
      stroke: #FED966;
      stroke-width: 3;
      stroke-dasharray: 3 6;
    }

    .grid path {
      stroke-width: 0;
    }

    .grid .tick line {
      stroke: #9FAAAE;
      stroke-opacity: 0.3;
    }

    text.${id}divergence {
      font-size: 14px;
      fill: #2F4A6D;
    }

    text.${id}value {
      font-size: 14px;
    }

    text.title {
      font-size: 22px;
      font-weight: 600;
    }

    text.label {
      font-size: 14px;
      font-weight: 400;
    }

    text.source {
      font-size: 10px;
    }
    </style>
    <div id='${id}barlayout'>
        <!-- <h2>Bar chart example</h2> -->
        <div id="${id}">
          <svg id="${id}svg" width="${width}" height="${height}"/>
        </div>
    </div>
    <script>
    function doit(){
        const svg = d3.select('#${id}svg');
        const svgContainer = d3.select('#${id}');
        const sample = (${sData});
        

        const margin = 80;
        const width = ${width} - 2 * margin;
        const height = ${height} - 2 * margin;
        
        const chart = svg.append('g')
          .attr('transform', \`translate(\${margin}, \${margin})\`);

        const xScale = d3.scaleBand()
          .range([0, width])
          .domain(sample.map((s) => s.key))
          .padding(0.4)

        const yScale = d3.scaleLinear()
          .range([height, 0])
          .domain([0, ${maxV * 1.15}]);


        const makeYLines = () => d3.axisLeft()
          .scale(yScale)

        chart.append('g')
          .attr('transform', \`translate(0, \${height})\`)
          .call(d3.axisBottom(xScale));

        chart.append('g')
          .call(d3.axisLeft(yScale));

            console.log(sample,svgContainer);

        chart.append('g')
          .attr('class', 'grid')
          .call(makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat('')
          )

        const barGroups = chart.selectAll()
          .data(sample)
          .enter()
          .append('g')

        barGroups
          .append('rect')
          .attr('class', '${id}bar')
          .attr('x', (g) => xScale(g.key))
          .attr('y', (g) => yScale(g.value))
          .attr('height', (g) => (console.log('height',g),height - yScale(g.value)))
          .attr('width', xScale.bandwidth())
          .on('mouseenter', function (actual, i) {
            d3.selectAll('.${id}value')
              .attr('opacity', 0)

            d3.select(this)
              .transition()
              .duration(300)
              .attr('opacity', 0.6)
              .attr('x', (a) => xScale(a.key) - 5)
              .attr('width', xScale.bandwidth() + 10)

            const y = yScale(actual.value)

            line = chart.append('line')
              .attr('id', '${id}limit')
              .attr('x1', 0)
              .attr('y1', y)
              .attr('x2', width)
              .attr('y2', y)

            barGroups.append('text')
              .attr('class', '${id}divergence')
              .attr('x', (a) => xScale(a.key) + xScale.bandwidth() / 2)
              .attr('y', (a) => yScale(a.value) + 30)
              .attr('fill', 'white')
              .attr('text-anchor', 'middle')
              .text((a, idx) => {
                const divergence = (a.value - actual.value).toFixed(1)

                let text = ''
                if (divergence > 0) text += '+'
                text += \`\${divergence}\`

                return idx !== i ? text : '';
              })

          })
          .on('mouseleave', function () {
            d3.selectAll('.${id}value')
              .attr('opacity', 1)

            d3.select(this)
              .transition()
              .duration(300)
              .attr('opacity', 1)
              .attr('x', (a) => xScale(a.key))
              .attr('width', xScale.bandwidth())

            chart.selectAll('#${id}limit').remove()
            chart.selectAll('.${id}divergence').remove()
          })

        barGroups 
          .append('text')
          .attr('class', '${id}value')
          .attr('x', (a) => xScale(a.key) + xScale.bandwidth() / 2)
          .attr('y', (a) => yScale(a.value) + 30)
          .attr('text-anchor', 'middle')
          .text((a) => \`\${a.value}\`)

        svg
          .append('text')
          .attr('class', 'label')
          .attr('x', -(height / 2) - margin)
          .attr('y', margin / 2.4)
          .attr('transform', 'rotate(-90)')
          .attr('text-anchor', 'middle')
          .text('${axisY}')

        svg.append('text')
          .attr('class', 'label')
          .attr('x', width / 2 + margin)
          .attr('y', height + margin * 1.7)
          .attr('text-anchor', 'middle')
          .text('${axisX}')

        svg.append('text')
          .attr('class', 'title')
          .attr('x', width / 2 + margin)
          .attr('y', 40)
          .attr('text-anchor', 'middle')
          .text('${title}')

        svg.append('text')
          .attr('class', 'source')
          .attr('x', width - margin / 2)
          .attr('y', height + margin * 1.7)
          .attr('text-anchor', 'start')
          .text('${source}');
    }
doit();
</script>
`);
}

function frameNumericColumns(aFrame) {
  const threshold = Math.trunc(aFrame.length * 0.9);
  const a = aFrame.data.map(row => row.map(v => ((isNum(v) || !v) ? 1 : 0)));
  const sums = a.reduce(vecAdd, undefined);
  console.log({ threshold, sums });

  return aFrame.columns.map((c, i) => ((sums[i] > threshold) ? c : undefined)).filter(Identity);
}


function isNum(v) {
  const nv = +v;
  if (isNaN(nv)) {
    return false;
  }
  return true;
}

function asNum(v) {
  const nv = +v;
  if (isNaN(nv)) {
    return v;
  }
  return nv;
}

function asObj(cols) {
  return arr => arr.reduce((obj, v, i) => (obj[cols[i]] = asNum(v), obj), {});
}

/*

// setup the data
// rows are the items
// columns attribute list to be displayed


//
var datas = `State,Under 5 Years,5 to 13 Years,14 to 17 Years,18 to 24 Years,25 to 44 Years,45 to 64 Years,65 Years and Over
CA,2704659,4499890,2159981,3853788,10604510,8819342,4114496
TX,2027307,3277946,1420518,2454721,7017731,5656528,2472223
NY,1208495,2141490,1058031,1999120,5355235,5120254,2607672
FL,1140516,1938695,925060,1607297,4782119,4746856,3187797
IL,894368,1558919,725973,1311479,3596343,3239173,1575308
PA,737462,1345341,679201,1203944,3157759,3414001,1910571`;
var fdata = datas.split('\n').map(s => s.split(',').map(asNum))
var colData = fdata[0];
fdata = fdata.slice(1);
var state = new Frame(fdata, colData);
frameNumericColumns(state);


*/

function frameChart(aFrame, props) {
  let {
    key, values, height, width, title, axisX, axisY, source,
  } = (props || {});
  key = key || aFrame.columns[0];
  values = (values || aFrame.columns.slice()).filter(v => v !== key);
  const id = genID();

  height = height || 500;
  width = width || 960;
  axisX = axisX || 'Keys';
  axisY = axisY || 'Values';
  source = source || '';
  title = title || 'No Title';
  const columns = JSON.stringify(values);
  const dataS = JSON.stringify(aFrame.data.map(asObj(aFrame.columns)));
  const keyS = JSON.stringify(key);
  const J = obj => JSON.stringify(obj || '');
  $$.html(`
    <style>

    .axis .domain {
      stroke: red;
    }

    .axisx {
        font-size: 1em;
        fill: gray;
    }

    .legend {
        fill: black;
    }

    .large {
        font-size: 1em;
        color: red;
        fill: black;
    }

    .titlec {
        font-size: 2em;
        fill: maroon;
    }

    </style>
    <div class="large" style="background-color: #e0e0e0">
      <svg id="${id}svg" width="${width}" height="${height}">
          <defs>
            <filter x="0" y="0" width="1" height="1" id="solid">
              <feFlood flood-color="grey"/>
              <feComposite in="SourceGraphic"/>
            </filter>
          </defs>
      </svg>
    </div>
    <script>
    function doit() {
        var data = ${dataS};
        var vkey = ${keyS};
        var columns = ${columns};

        var svg = d3.select("#${id}svg"),
            margin = {top: 30, right: 30, bottom: 50, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x0 = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.1);

        var x1 = d3.scaleBand()
            .padding(0.05);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);



          var keys = columns.slice();

          x0.domain(data.map(d => d[vkey]));
          x1.domain(keys).rangeRound([0, x0.bandwidth()]);
          y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

          g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
              .attr("transform", function(d) { return "translate(" + x0(d[vkey]) + ",0)"; })
            .selectAll("rect")
            .data(d => keys.map(key => ({key: key, value: d[key]}) ))
            .enter().append("rect")
              .attr("x", function(d) { return x1(d.key); })
              .attr("y", function(d) { return y(d.value); })
              .attr("width", x1.bandwidth())
              .attr("height", function(d) { return height - y(d.value); })
              .attr("fill", function(d) { return z(d.key); });

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x0));

          g.append("g")
              .attr("class", "axis")
              .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
              .attr("class", "legend")
              //.attr("filter", "url(#solid)")
              .attr("x", 2)
              .attr("y", y(y.ticks().pop()) + 0.5)
              .attr("dy", "0.32em")
              .attr("fill", "#000")
              .attr("font-weight", "bold")
              .attr("text-anchor", "start")
              .text(${J(axisY)});

          var legend = g.append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .attr("text-anchor", "end")
              //.attr("class", "legend")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 19)
              .attr("width", 19)
              .attr("height", 19)
              .attr("fill", z);

          legend.append("text")
              .attr("stroke", "black")
              .attr("x", width - 24)
              .attr("y", 9.5)
              .attr("dy", "0.32em")
              .text(function(d) { return d; });
          
        svg.append('text')
          .attr('class', 'axisx')
          .attr('x', width / 2 + margin.left)
          .attr('y', height + margin.top + margin.bottom * 0.7)
          .attr('text-anchor', 'middle')
          .text(${J(axisX)});

        svg
          .append('text')
          .attr('class', 'axisx')
          .attr('x', -(height / 2) - margin.top)
          .attr('y', -4+margin.left / 2.4)
          .attr('transform', 'rotate(-90)')
          .attr('text-anchor', 'middle')
          .text(${J(axisY)})

        svg.append('text')
          .attr('class', 'titlec')
          .attr('x', width / 2 + margin.left)
          .attr('y', 40)
          .attr('text-anchor', 'middle')
          .text(${J(title)})

        svg.append('text')
          .attr('class', 'source')
          .attr('x', width - margin.right / 2)
          .attr('y', height + margin.top * 1.7)
          .attr('text-anchor', 'start')
          .text(${J(source)});
    }
    doit();
    </script>

`);
}



'LOADED';

