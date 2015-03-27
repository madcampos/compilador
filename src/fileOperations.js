/**
 * The file operation module
 * @module src/fileOperations
 */

let error = require('./error');
let fs = require('fs');
let path = require('path');

module.exports = function(pathString){
	pathString = path.normalize(pathString);
	//TODO: solve file reading problems
	/*if (!fs.accessSync(pathString, fs.F_OK) ) {
		error('file not found', [0,0]);
		return;
	} else {
		if (!fs.accessSync(pathString, fs.R_OK | fs.X_OK)) {
			error('cant open file', [0,0]);
			return;
		} else {
			let file = fs.readFileSync(pathString, {encoding: 'utf8'});
			if (file === '') {
				error('empty source code', [0,0]);
				return;
			} else {
				return file;
			}
		}
	}*/
	return fs.readFileSync(pathString, {encoding: 'utf8'});
};