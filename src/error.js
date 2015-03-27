/**
 * Handler module for errors
 * @module src/error
 */
let errorList = require('../lang/rules').errors;

/**
 * Log the error to the console given the error alias.
 * @param {String} alias - The error alias.
 * @param {[Number, Number] | Token} token - The token where the error occured.
 */
module.exports = function(alias, token){
	let tokenMsg = '';

	if (Array.isArray(token)) {
		tokenMsg = `Line: ${token[0]}, Column: ${token[1]}.`;
	} else {
		tokenMsg = `Line: ${token.position[0]}, Column: ${token.position[1]} @ Symbol: "${token.symbol}" (${token.class}: ${token.type}).`;
	}

	let err = errorList.find(function(el){
		return el.alias === alias;
	});

	//TODO: implement stack trace
	console.error(`${err.scope} error ${err.code}: ${err.message}
	${tokenMsg}`);
};