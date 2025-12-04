# code_splitter.node

This is a script 
designed to **process template files**, extract individual code blocks, and generate a structured directory with individual `.js` files for each function or component defined in the templates. Let’s break down what the entire script is doing step-by-step:

### **Overall Purpose:**
The script is designed to:
1. **Read specialized template files** (files ending in `.js.tp` and prefixed with an underscore `_`) from a specified directory.
2. **Split the content** of these template files into smaller, logical pieces based on defined markers (e.g., `//@@`).
3. **Extract and transform import and export statements** in each file block.
4. **Write each code block** into its own JavaScript file within a corresponding directory.
5. **Create an `index.js` file** to manage and export all the components/functions within the newly created directory.

### **Key Functions and Their Roles:**

1. **`readAllSplitableFilesInDir(dir)`**:
   - This function scans a given directory (`dir`) for all the template files that match the pattern (`*.js.tp`) and are prefixed with an underscore (`_`).
   - **Output**: It returns a list of file objects, each containing details like the file name and a reference to a `getFileContents` function.

2. **`getFileContents()`**:
   - This function reads the contents of a single template file and **splits it into separate code blocks** based on markers (e.g., `//@@`).
   - It stores the initial section of the file in `first` and the remaining blocks in `blocks`.
   - Adds a `getImports` method to extract import statements from the `first` section.

3. **`_getImports()`**:
   - Extracts and stores the import statements from the `first` block of the file.
   - Adds a `getExports` method for further processing.

4. **`_getExports()`**:
   - Analyzes the remaining code blocks (`blocks`) and identifies the export statements.
   - Categorizes them into `default` exports and `named` exports.
   - Stores these exports in `this.exports` for use in further processing.

5. **`_getExportsOfBlock(block)`**:
   - Extracts individual export statements from a single block of code.
   - Distinguishes between **default exports** and **named exports**, and returns structured objects representing each export.

6. **`getName(dir, anExp)`**:
   - Determines the **file name** based on the provided export information.
   - Checks if the export is a **default export** or a **named export** and constructs the **file path** accordingly.

7. **`modifyImportPath(dir, imports)`**:
   - Modifies import paths to ensure they point to the correct location based on the directory structure.
   - Checks the existence of the file in the specified directory using `isFile` and adjusts the import path if needed.

8. **`writeBlock(dir, aB, fileData)`**:
   - Writes the contents of a single code block (`aB`) to a new `.js` file based on the `fileData` (e.g., file path and export type).
   - Adjusts import paths within the block and ensures that the export statements are correctly formatted.
   - Writes the transformed content to a new file.

9. **`processFile(aFile, toDelDir)`**:
   - **Main function** that processes a single template file.
   - Reads the content, extracts imports and exports, and determines the directory path.
   - If the `toDelDir` flag is set, it deletes any existing directory and creates a new one.
   - Writes each export to its own `.js` file and generates an `index.js` file to manage the exports.

### **How It All Comes Together:**
1. **Directory Scan and Identification**:
   - The script starts by scanning a specified directory using `readAllSplitableFilesInDir(dir)`.
   - This function identifies all the files that match the naming convention (`*.js.tp` files starting with `_`).

2. **File Content Parsing and Splitting**:
   - For each identified file, the `getFileContents` method is called, which reads and splits the template file into separate code blocks.
   - Import statements are extracted using `getImports()`, and the individual code blocks are further processed using `getExports()`.

3. **Export Handling and Directory Creation**:
   - Each export statement (both default and named) is analyzed using `getName()` and `modifyImportPath()` to generate appropriate file names and paths.
   - The script creates a corresponding directory structure based on these names.

4. **Writing Code Blocks to Individual Files**:
   - Each code block is written to its own file using `writeBlock()` with adjusted import paths and formatted exports.
   - The `index.js` file is generated using `writeIndex()` to centralize the exports of all components/functions.

5. **Repeat for Each File**:
   - The above steps are repeated for all the identified template files, resulting in a structured and modular output directory.

### **Practical Use Case:**
- This script is useful when dealing with **template files** that define **multiple small components** (e.g., React components or utility functions) in a single file.
- It **automates** the process of **splitting** these files into smaller, manageable pieces, and **generates an `index.js` file** to make importing these components easier in a larger project.

### **Potential Improvements:**
- Add error handling for edge cases like missing directories or malformed template files.
- Enhance logging to provide more informative output, such as skipped files or detailed error messages.
- Consider allowing configurable markers (e.g., allowing users to define their own split markers instead of `//@@`).

This explanation summarizes what the entire script is doing based on the code you've shared. If there are additional pieces you’d like to dive into or specific questions about any part, let me know!