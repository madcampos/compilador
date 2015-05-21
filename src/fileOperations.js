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
		error('arquivo não encontrado', null, null, null, true);
	} else {
		fs.access(pathString, fs.R_OK, function(err){
			if (err) {
				error('impossivel abrir arquivo', null, null, null, true);
			} else {
				return fs.readFileSync(pathString, {encoding: 'utf8'});
			}
		});
	}
};
