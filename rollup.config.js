import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';

export default {
	input: "src/index.js",
	output: {
		file: "dist/bundle.js",
		format: "cjs"
	},
	plugins: [
	    minify( 
			{
			    "evaluate": false,
			    "mangle": true
			}
		),
	    resolve(),
		babel({
			exclude: "node_modules/**",
			comments: false
		})
	]
}

//var rollup = require("rollup");

// rollup.rollup({
//   entry: "src/main.js",
//   plugins: [ babel() ]
// }).then(function (bundle) {
//   bundle.write({
//     dest: "dist/bundle.js",
//     format: "umd"
//   });
// });

