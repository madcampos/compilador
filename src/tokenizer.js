/**
 * This module is responsible for the tokenization of the source code.
 * @module src/tokenizer
 */

let error = require('./error');

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
let generateToken = (function(){
	let typeList = require('../lang/rules').types;

	function _generateToken(symbol, rawPosition){
		let token = {};

		token.symbol = symbol;
		token.position = {
			line: Number.parseInt(rawPosition[0]) + 1,
			column: rawPosition[1] + 1,
			length: rawPosition[2] || 1
		};


		console.log('\n' + token.symbol + '\n');

		//TODO: add precedence to token
		typeList.forEach(function(type){
			console.log(type.name + ': ' + type.rule.test(symbol));
			if (type.rule.test(symbol)) {
				token.type = type.name;
				token.class = type.class;

			}
		});

		//TODO: generate unknown token error


		/**
		 * The token of the language.
		 * @typedef {Object} Token
		 * @property {String} symbol - The token symbol.
		 * @property {String} type - The token type name.
		 * @property {String} class - The token type class.
		 * @property {Array} position - The token position.
		 * @property {Number} position[0] - The token line.
		 * @property {Number} position[1] - The token column.
		 * @property {Number} position[2] - The token length.
		 * @proprety {scope} scope - The token scope.
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
	let wordDelimiters = require('../lang/rules').wordDelimiters;
	let tokenList = [];
	let sourceLines = source.split('\n');

	for (let line in sourceLines) {
		let match;
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