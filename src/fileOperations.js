/**
 * The file operation module
 * @module src/fileOperations
 */

let error = require('./error');
let fs = require('fs');
let path = require('path');

module.exports = function(pathString){
	pathString = path.normalize(pathString);

	if (!fs.existsSync(pathString) ) {
		error('file not found', [0,0]);
		return;
	} else {
		//TODO: solve file reading problems
		//TODO: fs.acess trows an error or does nothing, so needs to use the async version to catch error
		if (false) {
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
	}
};
