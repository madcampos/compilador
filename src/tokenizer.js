/**
 * This module is responsible for the tokenization of the source code.
 * @module src/tokenizer
 */

var error = require('./error');

//TODO: rename to seeder & seeds to keep up with the consept of growing a plant

/**
 * The token constructor.
 * @constructor
 * @param {String} symbol - The symbol string.
 * @param {Number[]} rawPosition - The token raw position (a.k.a.: 0 starting position).
 * @param {Number} rawPosition[0] - The token line.
 * @param {Number} rawPosition[1] - The token column.
 * @param {Number} [rawPosition[2]=1] - The token length.
 * @returns {Token} The token generated from the symbol and position.
 */
 //TODO: refactor to not use 'new', instead use another method of generating obects
var generateToken = (function(){
	var typeList = require('../lang/rules').types;
	var scopify = require('./scopify');

	function _generateToken(symbol, rawPosition){
		var token = {};

		token.symbol = symbol;
		token.position = {
			line: Number.parseInt(rawPosition[0]) + 1,
			column: rawPosition[1] + 1,
			length: rawPosition[2] || 1
		};

		typeList.forEach(function(type){
			if (type.rule.test(symbol)) {
				token.type = type.name;
				token.class = type.class;
			}
		});

		//TODO: find token scope
		token.scope = scopify(token);

		/**
		 * the token of the language.
		 * @typedef {Object} Token
		 * @property {String} symbol - The token symbol.
		 * @property {String} type - The token type name.
		 * @property {String} class - The token type class.
		 * @property {Array} position - The token position.
		 * @property {Number} position[0] - The token line.
		 * @property {Number} position[1] - The token column.
		 * @property {Number} position[2] - The token length.
		 * @proprety {Scope} scope - The token scope.
		 */
		return token;
	}
	return _generateToken;
})();

/**
 * Tokenize the source code and fill the Symbol Table.
 * @param {String} source - The source code to be tokenized.
 * @returns {Token[]} The list of tokens generated form the source code.
 */
function tokenize(source){
	var wordDelimiters = require('../lang/rules').wordDelimiters;
	var tokenList = [];
	var sourceLines = source.split('\n');

	for (var line in sourceLines) {
		var match;
		while ((match = wordDelimiters.exec(sourceLines[line])) !== null) {
			tokenList.push(generateToken(match[0], [line, match.index, match[0].length]));
		}
	}

	if (tokenList.length === 0) {
		error('source dont contain tokens', [0,0]);
	}

	return tokenList;
}

module.exports = tokenize;