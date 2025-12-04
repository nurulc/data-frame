The script recognizes template files using specific file naming patterns and extensions.  It identifies template files as follows:

### **Template File Identification:**

Template files look like the following:

> `_file_name.js.tp`

The steps it uses to match files is as  follows:

1. **File Extension Pattern**:
   - The script looks for files with a specific extension: `*.js.tp`.
   - This is accomplished using the following line in the `readAllSplitableFilesInDir` function:

   ```javascript
   let list = fs.readdirSync(dir).filter(n => n.match(/\.js\.tp$/));
   ```

   - **Explanation**:
     - `fs.readdirSync(dir)`: Reads all file names in the given directory (`dir`).
     - `.filter(n => n.match(/\.js\.tp$/))`: Filters the list to include only files that end with `.js.tp`.
     - This regular expression (`\.js\.tp$`) matches any file name that ends with `.js.tp`.
     - Examples of recognized template files: `_exampleFile.js.tp`, `_utils.js.tp`.

2. **File Name Prefix**:
   - After filtering by file extension, the script further refines the list by selecting only those files that **start with an underscore (`_`)**.
   - This is done using the following line:

   ```javascript
   .filter(name => name[0] === '_');
   ```

   - **Explanation**:
     - `name[0] === '_'`: Checks if the first character of the file name is an underscore.
     - This convention indicates that the file is meant to be a "template" that can be split into multiple smaller pieces.

3. **Combining the Filters**:
   - The two filters (`.js.tp` extension and leading underscore `_`) are applied sequentially in the following line:

   ```javascript
   let list = fs.readdirSync(dir).filter(n => n.match(/\.js\.tp$/)).filter(name => name[0] === '_');
   ```

   - **Result**:
     - Only files with names that start with an underscore (`_`) and end with `.js.tp` are considered **template files**.
     - If a file named `example.js.tp` exists (without a leading underscore), it will be excluded.
     - If a file named `_exampleFile.js` exists (without the `.tp` extension), it will also be excluded.

### **Example of Recognized Template Files**:
- **Valid Template Files**:
  - `_arrayUtils.js.tp`
  - `_componentA.js.tp`
  - `_someFile.js.tp`

- **Ignored Files**:
  - `arrayUtils.js.tp` (No leading underscore)
  - `_componentA.js` (Missing `.tp` extension)
  - `_exampleFile.js` (Missing `.tp` extension)
  - `randomFile.txt` (Wrong extension)

### **Usage in `readAllSplitableFilesInDir`**:
The `readAllSplitableFilesInDir` function uses this pattern to create a list of template files that need to be processed:

```javascript
function readAllSplitableFilesInDir(dir) {
    let list = fs.readdirSync(dir)
                 .filter(n => n.match(/\.js\.tp$/))  // Step 1: Match only *.js.tp files
                 .filter(name => name[0] === '_');   // Step 2: Select only files starting with '_'
    
    let files = list.map(name => name.replace(/\.js.tp$/, '').substr(1)); // Remove '.js.tp' and leading '_'
    
    return files.map(file => ({ dir, file, getFileContents: getFileContents }));
}
```

- **Explanation**:
  - The identified template files are then processed further by:
    - Removing the `.js.tp` extension.
    - Removing the leading `_` from the file name (e.g., `_exampleFile.js.tp` becomes `exampleFile`).
  - It returns an array of file objects with properties like `dir`, `file`, and a reference to the `getFileContents` function.

### **Summary**:
The script identifies template files based on:
1. **File extension**: Must end with `.js.tp`.
2. **File name prefix**: Must start with an underscore (`_`).

This convention helps the script differentiate between regular source files and special template files that are meant to be processed, split, and converted into separate `.js` modules.

