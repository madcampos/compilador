/**
 * Scopify a Token.
 * @module src/scopify
 */
let error = require('./error');

let curentScope = 0;
let scopeList = [];
let scopeDelimiters = require('../lang/rules').scopeDelimiters;

/**
 * Find the current scope of the given token and the token stack to follow.
 * @param {Token} scopelessToken - A token without scope to be found the scope.
 * @returns {Object} The token's scope information.
 */
module.exports = function(scopelessToken) {
	/**
	 * Scope model definition.
	 * @typedef {Object} scope
	 * @property {String} type - The scope type.
	 * @property {Number} precedence - The scope type.
	 * @property {String} name - The scope type.
	 * @property {Number[]} stack - The scope type.
	 * @property {Object[]} lets - The scope type.
	 * @property {Object[]} consts - The scope type.
	 * @property {Token} startDelimiter - The token that starts the scope.
	 * @property {Token} stopDelimiter - The token that starts the scope.
	 */
	let scope = {};
	let isDelimiter = false;

	return {
		isDelimiter: isDelimiter,
		scope: curentScope
	}

};

/**
 * Find a scope by it's identifier
 * @param {Number} id - The scope's identifier.
 * @returns {scope} The scope refered by the identifier.
 */
exports.findScope = function(id){
	return scopeList[id];
};