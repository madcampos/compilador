var tokenizer = require('./src/tokenizer');
var fileOperations = require('./src/fileOperations');

function tokenize(path){
	return tokenizer(fileOperations(path));
}

module.exports = {
	tokenize: tokenize
};