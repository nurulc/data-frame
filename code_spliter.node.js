// Code Splitter




// Dependency
const fs = require('fs');
const LOGLEVEL = 2;
// Main

splitSourceFilesInDir("./src/frame", true);
splitSourceFilesInDir("./src/array", true);
splitSourceFilesInDir("./src/string", true);
splitSourceFilesInDir("./src/dict", true);
splitSourceFilesInDir("./src/utils", true);

// Code

function splitSourceFilesInDir(dir, toDelPrevData) {
    var files = readAllSplitableFilesInDir(dir);
    clog(files);
    files.forEach(f => processFile(f,toDelPrevData));  
}





function readAllSplitableFilesInDir(dir) {
    let list =fs.readdirSync(dir).filter(n => n.match(/\.js\.tp$/)).filter(name => name[0] === '_');
    let files = list.map(name => name.replace(/\.js.tp$/,'').substr(1));
    let usableFiles = files.filter(name =>!fs.existsSync(`$dir/name`));
    let existing = files.filter(name =>fs.existsSync(`$dir/name`));
    if(existing && existing.length > 0) clogX(2,"The following directories alreaddy exist", existing)
    return files.map(file => ({dir, file, getFileContents: getFileContents}));
}

function getFileContents() {
    let {dir, file} = this;
    let str = fs.readFileSync(`${dir}/_${file}.js.tp`, 'utf8').replace(/\r/g,'');
    
    let [first, ...blocks] = str.split(/\/\/@@?/);
    this.first = first;
    this.blocks = blocks;
    this.getImports = _getImports;
    return this;
}

function _getImports() {
    let {dir, file, first, blocks} = this;
    this.imports = first.split("\n").filter(line => line.startsWith('import ') );
    this.getExports = _getExports;
    return this;
}

function _getExports() {
    let {blocks} = this;
    //clog(blocks.length);
    this.exports = blocks.map(_getExportsOfBlock);
    return this;
}

function _getExportsOfBlock(block) {
    let lines = block.split("\n");
    let exps = lines.filter(l => l.match(/export/));
    let exports = exps.map(l => l.split(/\s+/));
    let defaults = exports.filter(l => l[1]=== 'default').map(([_,__,type,name])=> ({type,name: strip(name)}));
    exports = exports.filter(l => l[1] !== 'default').map(([_,type,name])=> ({type,name: strip(name)}));
    
    if(defaults.length > 1) throw new Error("too name defaaults"+ defaults.toString());
    return {block, exports, defaults};
}

function strip(name) {
    let ix = name.indexOf('(');
    if(ix >=0 ) return name.substr(0,ix);
    return name;
}

function getName(dir,anExp) {
    let {defaults, exports} = anExp;
    let name = '';
    let isDefault = !isEmpty(defaults)
    if( isDefault ) name = defaults[0].name;
    else name = exports[0].name;
    let path = dir+"/"+name+'.js';
    
    return [path, isDefault, name, exports.map(e => e.name)];
}

function isFile(path) {
    return fs.existsSync(path+'.js') || fs.existsSync(path)
}


function modifyImportPath(dir,imports) {
    let [parts,file] = imports.replace(/import(.*)from\s['"]([a-zA-z0-9* ._/-]+)(['"].*)/,"$1\t$2")
                    .split('\t');
    let prefix = ['.', '../'].filter(pre => isFile(dir+'/'+pre+file));
    if(prefix.length === 0) return [file,file];
    return [file, prefix[0]+file];
}   

function writeBlock(dir, aB, fileData ) {
    let [path,dflt, funcName, allExports] = fileData;
    clogX(4,"Cretae file", path);
    let lines = aB.block.split(/\r?\n/)
        .map(l => l.replace(/\/\/##\s*/g, '')
                   .replace(/^@\s+\n/,'') );
    let imports = lines.filter(l => l.match(/import\s/));
        

    let pth = allButLast(path)
    let newImports = imports.map(l => {
        let [old,nw] = modifyImportPath(pth, l );
        clog({pth, old,nw})
        return [l,l.replace(old,nw)]
    }).reduce((o,[k,v]) => (o[k]=v,o),{})
    newImports['@'] = '//'+path
    let data = lines.map(mapper(newImports)).join('\n');
    data = data
        .replace(/export\s+default\s+const\s+[a-zA-Z0-9_$]+\s+=/g, "export default ")
      
    
    clog(data);
    fs.writeFileSync(path, data);
    return fileData;
}



function processFile(aFile,toDelDir) {
   let fdat =  aFile.getFileContents().getImports().getExports();
    clog(Object.keys(fdat));
    clog(fdat.file, 'dir',fdat.dir);
    let dir = fdat.dir+'/'+fdat.file;
    if(toDelDir) rmdir(dir);
    createDir(dir,toDelDir);
    let funcs = fdat.exports.map(e => writeBlock(dir, e,getName(dir,e)) );
    let res = writeIndex(dir, funcs);
    clog(res);
}

function writeIndex(dir, funcs) {
    let src = "";
    let other = 0;
    let path = funcs.length >0?funcs[0][0]:undefined;
    for(let i=0; i<funcs.length; i++) {
        let [d, isDefault, func, exports] = funcs[i];
        if(isDefault) {
          src += "import _"+func+" from './"+func+"';\n";
          src += "export const "+func+" = _"+func+";\n\n"
        } else src += "export * from './"+func+"';\n";
    }

    if(path) {
        let index = allButLast(path)+"/index.js";
        fs.writeFileSync(index, src);
        return {index, src};
    }
    return undefined;
}

// Utils ============================================================

function createDir(path, toDelDir) {
    if(!toDelDir && fs.existsSync(path)) throw new Error("dir "+path+" exists");
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
        clog("rmdir ", path);
        fs.rmdirSync(path)
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

function isEmpty(arrOrObj) {
	if(!arrOrObj) return true;
	if(isArray(arrOrObj) && arrOrObj.length === 0) return true;
	if(typeof arrOrObj === 'object' && 
			Object.keys(arrOrObj).length === 0 ) return true;
	return false;
}

function isArray(arr) {
	if( !arr) return null;
	if(Array.isArray(arr)) return arr;
	return (arr.constructor === Array || ArrayBuffer.isView(arr))?arr:null;
}
 
function clogX(logLevel, ...args) {
	if(LOGLEVEL >= logLevel) console.log(...args);
}

function clog(...args) { clogX(5,...args); }