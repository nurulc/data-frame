// Code Splitter
/**
 * Splits source files in a directory by processing each file.
 * 
 * @param {string} dir - The directory path containing the source files to split.
 * @param {boolean} toDelPrevData - Indicates whether to delete previous data in the directory.
 */



// Dependency
const fs = require('fs');
const LOGLEVEL = 2;
const COPYRIGHT_NOTICE =`// jshint undef:true
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
`;

// Main

splitSourceFilesInDir('./src/frame', true);
splitSourceFilesInDir('./src/array', true);
splitSourceFilesInDir('./src/string', true);
splitSourceFilesInDir('./src/dict', true);
splitSourceFilesInDir('./src/utils', true);


// Code



function processFile(aFile,toDelDir) {
	let fdat =  aFile.getFileContents().getImports().getExports();
	clog(Object.keys(fdat));
	clog(fdat.file, 'dir',fdat.dir);
	let dir = fdat.dir+'/'+fdat.file;
	if(toDelDir) rmdir(dir);
	createDir(dir,toDelDir);
	//console.log(fdat.exports.map(e => e.defaults));
	let funcs = fdat.exports.map(e => writeBlock(dir, e,getName(dir,e)) );
	let res = writeIndex(dir, funcs);
	clog(res);
}
/**
 * Splits source files in a given directory by processing each file and optionally deleting previous data.
 * The function first reads all the splitable files in the specified directory using `readAllSplitableFilesInDir`.
 * Then, it iterates through each file and calls `processFile` to handle the splitting and data processing logic.
 *
 * @function splitSourceFilesInDir
 * @param {string} dir - The directory path containing the source files to be split.
 * @param {boolean} toDelPrevData - Flag indicating whether to delete previous data associated with the source files.
 * @returns {void}
 *
 * @example
 * splitSourceFilesInDir('./src/templates', true);
 * // This will split all files in './src/templates' and delete any existing data for the processed files.
 */
function splitSourceFilesInDir(dir, toDelPrevData) {
	var files = readAllSplitableFilesInDir(dir);
	clog(files);
	files.forEach(f => processFile(f,toDelPrevData));  
}




/**
 * Reads all splitable files in a given directory and returns an array of file metadata objects.
 * The function specifically looks for files with a `.js.tp` extension, which start with an underscore (`_`),
 * indicating that they are template files to be split.
 *
 * @function readAllSplitableFilesInDir
 * @param {string} dir - The directory path to search for splitable files.
 * @returns {Array<Object>} An array of file metadata objects, where each object contains:
 * - `dir` {string}: The directory path.
 * - `file` {string}: The name of the file (without the `.js.tp` extension and leading underscore).
 * - `getFileContents` {Function}: A reference to the `getFileContents` function to read the content of the file.
 *
 * @example
 * const splitableFiles = readAllSplitableFilesInDir('./src/templates');
 * console.log(splitableFiles);
 * // Output:
 * // [
 * //   { dir: './src/templates', file: 'example1', getFileContents: [Function: getFileContents] },
 * //   { dir: './src/templates', file: 'example2', getFileContents: [Function: getFileContents] }
 * // ]
 */
function readAllSplitableFilesInDir(dir) {
	let list =fs.readdirSync(dir).filter(n => n.match(/\.js\.tp$/)).filter(name => name[0] === '_');
	let files = list.map(name => name.replace(/\.js.tp$/,'').substring(1));
	//let usableFiles = files.filter(name =>!fs.existsSync(`${dir}/${name}`));
	//let existing = files.filter(name =>fs.existsSync(`${dir}/${name}`));
	//if(existing && existing.length > 0) clogX(2,'The following directories alreaddy exist', existing);
	return files.map(file => ({dir, file, getFileContents: getFileContents}));
}

function removeFirstLine(s) {
	let ix = s.indexOf('\n');
	if(ix <= 0) return s;
	return s.substr(ix);
}
/**
 * Reads and processes the content of a source file associated with the current object.
 * This function reads a `.js.tp` template file from the specified directory and file name,
 * splits the content into separate code blocks based on `//@@` markers, and stores the processed content
 * in `first` and `blocks` properties of the object. It also sets up a method `getImports` to extract import statements.
 *
 * @function getFileContents
 * @this {Object} The object context containing `dir` and `file` properties.
 * @property {string} dir - The directory path where the template file is located.
 * @property {string} file - The file name (without the `.js.tp` extension and leading underscore).
 * @returns {Object} The current object with the following properties updated:
 * - `first` {string}: The initial part of the file before the first `//@@` marker.
 * - `blocks` {Array<string>}: An array of code blocks extracted from the file after the first `//@@` marker.
 * - `getImports` {Function}: A method to retrieve the import statements from the file.
 *
 * @example
 * const fileObject = { dir: './src/templates', file: 'exampleFile' };
 * fileObject.getFileContents();
 * console.log(fileObject.first); // Logs the initial part of the file content
 * console.log(fileObject.blocks); // Logs an array of split code blocks
 */
function getFileContents() {
	let {dir, file} = this;
	let str = fs.readFileSync(`${dir}/_${file}.js.tp`, 'utf8').replace(/\r/g,'');
	
	let [first, ...blocks] = str.split(/\/\/@@?/);
	this.first = first;
	this.blocks = blocks.map(removeFirstLine);
	this.getImports = _getImports;
	return this;
}

/**
 * Extracts and processes import statements from the current object's `first` code block.
 * This function searches through the initial section of the file content (`first`) for lines that start with `import`.
 * It then stores these import statements in an `imports` property and sets up a method `getExports` for future export extraction.
 *
 * @function _getImports
 * @this {Object} The object context containing properties related to the file and its contents.
 * @property {string} dir - The directory path where the template file is located.
 * @property {string} file - The file name (without the `.js.tp` extension and leading underscore).
 * @property {string} first - The initial part of the file before the first `//@@` marker.
 * @property {Array<string>} blocks - An array of code blocks extracted from the file after the first `//@@` marker.
 * @returns {Object} The current object with the following properties updated:
 * - `imports` {Array<string>}: An array containing all import statements found in the `first` block.
 * - `getExports` {Function}: A method to extract export statements from the file.
 *
 * @example
 * const fileObject = {
 *   dir: './src/templates',
 *   file: 'exampleFile',
 *   first: 'import something from "./something";\nconst x = 10;',
 *   blocks: ['//@@ block content']
 * };
 * fileObject._getImports();
 * console.log(fileObject.imports); // ['import something from "./something";']
 * console.log(fileObject.getExports); // [Function: _getExports]
 */
function _getImports() {
	let {/*dir,file,*/  first /*, blocks*/ } = this;
	this.imports = first.split('\n').filter(line => line.startsWith('import ') );
	this.getExports = _getExports;
	return this;
}

/**
 * Extracts export statements from the code blocks stored in the current object.
 * This function iterates over each code block (stored in the `blocks` property) and applies the `_getExportsOfBlock` helper function
 * to extract export statements. The results are stored in the `exports` property of the object.
 *
 * @function _getExports
 * @this {Object} The object context containing properties related to the file and its content blocks.
 * @property {Array<string>} blocks - An array of code blocks extracted from the file after the first `//@@` marker.
 * @returns {Object} The current object with the following property updated:
 * - `exports` {Array<string>}: An array containing the export statements extracted from each code block.
 *
 * @example
 * const fileObject = {
 *   blocks: [
 *     'export const example = () => {};',
 *     'export default exampleFunction;'
 *   ]
 * };
 * fileObject._getExports();
 * console.log(fileObject.exports); // ['export const example = () => {};', 'export default exampleFunction;']
 */
function _getExports() {
	let {blocks} = this;
	//clog(blocks.length);
	this.exports = blocks.map(_getExportsOfBlock);
	return this;
}

/**
 * Extracts and categorizes export statements from a given code block.
 * This function processes a block of code by breaking it into lines and filtering for lines that contain `export` statements.
 * It then distinguishes between default and named exports and structures them into separate categories.
 *
 * @function _getExportsOfBlock
 * @param {string} block - The block of code to process for export statements.
 * @returns {Object} An object containing the following properties:
 * - `block` {string}: The original block of code that was processed.
 * - `exports` {Array<Object>}: An array of named export objects, where each object has:
 *   - `type` {string}: The type of the export (e.g., `const`, `function`).
 *   - `name` {string}: The name of the exported variable or function.
 * - `defaults` {Array<Object>}: An array of default export objects, where each object has:
 *   - `type` {string}: The type of the export (e.g., `function`).
 *   - `name` {string}: The name of the exported default variable or function.
 *
 * @throws {Error} Throws an error if there are multiple default exports or if no exports are defined in the block.
 *
 * @example
 * const block = `
 *   export const function1 = () => {};
 *   export default function2;
 * `;
 * const result = _getExportsOfBlock(block);
 * console.log(result);
 * // Output:
 * // {
 * //   block: '\n  export const function1 = () => {};\n  export default function2;\n',
 * //   exports: [{ type: 'const', name: 'function1' }],
 * //   defaults: [{ type: 'function', name: 'function2' }]
 * // }
 */
function _getExportsOfBlock(block) {
	let lines = block.split('\n');
	let exps = lines.filter(l => l.match(/export/));
	let exports = exps.map(l => l.trim().split(/\s+/));

	
	let defaults = exports.filter(l => l[1]=== 'default').map(([_,__,type,name])=> ({type,name: strip(name)}));
	exports = exports.filter(l => l[1] !== 'default').map(([_,type,name])=> ({type,name: strip(name)}));
	//if(exps.some(s => s.match('const')) ) console.log({block, exports, d: defaults});
	
	if(defaults.length > 1) throw new Error('too name defaults'+ defaults.toString());
	if(exports.length === 0 && defaults.length === 0) throw new Error('no exports defined in section: '+ block);
	return {block, exports, defaults};
}

function strip(name) {
	let ix = name.indexOf('(');
	if(ix >=0 ) return name.substr(0,ix);
	return name;
}

/**
 * Generates a file path and extracts name-related details from an export object.
 * This function determines whether the provided export object has a default export or named exports.
 * It returns the file path, a flag indicating if it’s a default export, the main name of the export, and an array of all named exports.
 *
 * @function getName
 * @param {string} dir - The directory path where the file will be located.
 * @param {Object} anExp - The export object containing `defaults` and `exports` properties.
 * @param {Array<Object>} anExp.defaults - An array of default export objects, where each object has:
 *   - `type` {string}: The type of the export (e.g., `function`).
 *   - `name` {string}: The name of the exported default entity.
 * @param {Array<Object>} anExp.exports - An array of named export objects, where each object has:
 *   - `type` {string}: The type of the export (e.g., `const`, `function`).
 *   - `name` {string}: The name of the exported variable or function.
 * @returns {Array} Returns an array with the following elements:
 * - `path` {string}: The generated file path based on the main export name.
 * - `isDefault` {boolean}: A flag indicating if the export is a default export (`true` if default).
 * - `name` {string}: The name of the main export (either default or the first named export).
 * - `allExportNames` {Array<string>}: An array containing the names of all named exports.
 *
 * @example
 * const dir = './src';
 * const exportObject = {
 *   defaults: [{ type: 'function', name: 'mainFunction' }],
 *   exports: [{ type: 'const', name: 'helper1' }, { type: 'const', name: 'helper2' }]
 * };
 * const [path, isDefault, name, allExportNames] = getName(dir, exportObject);
 * console.log(path); // './src/mainFunction.js'
 * console.log(isDefault); // true
 * console.log(name); // 'mainFunction'
 * console.log(allExportNames); // ['helper1', 'helper2']
 */
function getName(dir,anExp) {
	let {defaults, exports} = anExp;
	let name = '';

	let isDefault = !isEmpty(defaults);
	if( isDefault ) name = defaults[0].name;
	else name = exports[0].name;
	let path = dir+'/'+name+'.js';
	
	return [path, isDefault, name, exports.map(e => e.name)];
}

function isFile(path) {
	return fs.existsSync(path+'.js') || fs.existsSync(path);
}

/**
 * Modifies the import path of a given import statement based on the directory structure.
 * This function analyzes an import statement and adjusts the import path to ensure it points to the correct file
 * based on its presence in the specified directory. It returns both the original and modified import paths.
 *
 * @function modifyImportPath
 * @param {string} dir - The directory path to check for the file.
 * @param {string} imports - The import statement to be modified.
 * @returns {Array<string>} An array containing:
 * - `originalPath` {string}: The original file path extracted from the import statement.
 * - `modifiedPath` {string}: The modified file path with the appropriate prefix (`.` or `..`) if the file is found in the directory, or the original path if not modified.
 *
 * @example
 * const dir = './src/components';
 * const imports = "import myFunction from '../utils/helper'";
 * const [originalPath, modifiedPath] = modifyImportPath(dir, imports);
 * console.log(originalPath); // '../utils/helper'
 * console.log(modifiedPath); // '../utils/helper' (assuming file exists in the same directory)
 *
 * @example
 * const dir = './src';
 * const imports = "import myFunction from 'utils/helper'";
 * const [originalPath, modifiedPath] = modifyImportPath(dir, imports);
 * console.log(originalPath); // 'utils/helper'
 * console.log(modifiedPath); // './utils/helper' (if `./utils/helper` exists in the directory)
 */
function modifyImportPath(dir,imports) {
	let [parts,file] = imports.replace(/import(.*)from\s['"]([a-zA-z0-9* ._/-]+)(['"].*)/,'$1\t$2')
		.split('\t');
	let prefix = ['.', '../'].filter(pre => isFile(dir+'/'+pre+file));
	if(prefix.length === 0) return [file,file];
	return [file, prefix[0]+file];
}   

/**
 * Writes a processed code block to a new file with updated import paths and export statements.
 * This function takes a code block (`aB`), processes its content, modifies the import paths based on the directory structure,
 * and writes the transformed content to the specified file. It also ensures that the export statements are correctly formatted.
 *
 * @function writeBlock
 * @param {string} dir - The directory path where the file will be created.
 * @param {Object} aB - The code block object containing the block content and metadata.
 * @param {string} aB.block - The block of code to be written to the file.
 * @param {Array} fileData - An array containing file information, with the following elements:
 *   - `path` {string}: The complete file path where the processed content will be written.
 *   - `dflt` {boolean}: A flag indicating if the export is a default export.
 *   - `funcName` {string}: The main function name extracted from the export statement.
 *   - `allExports` {Array<string>}: An array of all named export variables or functions.
 * @returns {Array} Returns the `fileData` array after successfully writing the file.
 *
 * @example
 * const dir = './src';
 * const block = { block: 'import myFunc from "../utils/helper";\nexport default myFunc;' };
 * const fileData = ['./src/myFunc.js', true, 'myFunc', ['myFunc']];
 * const result = writeBlock(dir, block, fileData);
 * console.log(result);
 * // Output:
 * // ['./src/myFunc.js', true, 'myFunc', ['myFunc']]
 */
function writeBlock(dir, aB, fileData ) {
	let [path/*,dflt, funcName, allExports*/] = fileData;
	clogX(4,'Cretae file', path);
	let lines = aB.block.split(/\r?\n/)
		.map(l => l.replace(/\/\/##\s*/g, '')
			.replace(/^@\s+\n/,'') );
	let imports = lines.filter(l => l.match(/import\s/));
		

	let pth = allButLast(path);
	let newImports = imports.map(l => {
		let [old,nw] = modifyImportPath(pth, l );
		clog({pth, old,nw});
		return [l,l.replace(old,nw)];
	}).reduce((o,[k,v]) => (o[k]=v,o),{});
	newImports['@'] = '//'+path;
	let data = lines.map(mapper(newImports)).join('\n');
	data = data
		.replace(/export\s+default\s+const\s+[a-zA-Z0-9_$]+\s+=/g, 'export default '); 
	
	clog(data);
	fs.writeFileSync(path, COPYRIGHT_NOTICE+data);
	return fileData;
}



function writeIndex(dir, funcs) {
	let src = '';
	//let other = 0;
	let path = funcs.length >0?funcs[0][0]:undefined;
	for(let i=0; i<funcs.length; i++) {
		let [, isDefault, func/*, exports*/] = funcs[i];
		if(isDefault) {
			src += 'import _'+func+' from \'./'+func+'\';\n';
			src += 'export const '+func+' = _'+func+';\n\n';
		} else src += 'export * from \'./'+func+'\';\n';
	}

	if(path) {
		let index = allButLast(path)+'/index.js';
		fs.writeFileSync(index, COPYRIGHT_NOTICE+src);
		return {index, src};
	}
	return undefined;
}

// Utils ============================================================

function createDir(path, toDelDir) {
	if(!toDelDir && fs.existsSync(path)) throw new Error('dir '+path+' exists');
	clogX(4, `fs.mkdirSync(${path});`); 
	fs.mkdirSync(path);
}


function rmdir(path) {
	try {
		path = path || './';
		let files = fs.readdirSync(path);
		files.forEach( f => (clog(f), fs.unlinkSync(`${path}/${f}`)));
	} catch(e) {
		clogX(2,e);
	}
	try {
		clog('rmdir ', path);
		fs.rmdirSync(path);
	}catch(e) {
		clogX(2,e);
	}
}

function mapper(dict) {
	return l => dict[l] || l;
}

function allButLast(path) {
	let p = path.split('/');
	if(p.length > 1) return p.slice(0, p.length-1).join('/');
	return path;
}

/**
 * Check if the input array or object is empty.
 * @param {Array|Object} arrOrObj - The array or object to be checked.
 * @returns {boolean} Returns true if the input is empty, otherwise false.
 */
/**
 * Checks if an array, object, set, map, string, typed array, or other data structure is empty.
 *
 * @function isEmpty
 * @param {*} value - The data structure to check.
 * @returns {boolean} Returns true if the structure is empty, false otherwise.
 */
function isEmpty(value) {
	// Check for null, undefined, or falsey values
	if (value == null) return true;

	// Handle Strings
	if (typeof value === 'string') {
		return value.length === 0;
	}

	// Handle Array-like data structures
	if (typeof value === 'object') {
		if (isArray(value)) {
			return value.length === 0; // Check if Array is empty
		} else if (value instanceof Set || value instanceof Map) {
			return value.size === 0; // Check if Set or Map is empty
		} else if (value instanceof WeakSet || value instanceof WeakMap) {
			return false; // WeakSet and WeakMap cannot be truly "empty" as they are not iterable
		} else if (ArrayBuffer.isView(value)) { // Check for Typed Arrays
			return value.length === 0; // Check if TypedArray (e.g., Int8Array) is empty
		} else if (value instanceof ArrayBuffer) {
			return value.byteLength === 0; // Check for ArrayBuffer emptiness
		} else {
			return Object.keys(value).length === 0; // Check if plain Object is empty
		}
	}

	return false; // Non-empty or unsupported data types
}


function isArray(arr) {
	if( !arr) return null;
	if(Array.isArray(arr)) return arr;
	return (arr.constructor === Array || ArrayBuffer.isView(arr))?arr:null;
}
// Logging functions 
function clogX(logLevel, ...args) {
	if(LOGLEVEL >= logLevel) console.log(...args);
}

function clog(...args) { clogX(5,...args); }