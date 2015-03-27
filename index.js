let tokenizer = require('./src/tokenizer');
let fileOperations = require('./src/fileOperations');

function tokenize(path){
	return tokenizer(fileOperations(path));
}

module.exports = {
	tokenize: tokenize
};