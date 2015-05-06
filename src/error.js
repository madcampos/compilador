//FIXME: use proper error handling
//FIXME: rewrite to better show errors
//FIXME: use a library

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
//should write errors using template strings or other source, message should be dependent on an "data" object (message dependant) witch contains the itens used to the template string
module.exports = function(alias, token){
	//TODO: change token message to "default message" and construct its parts with the data object
	let tokenMsg = '';

	if (Array.isArray(token)) {
		tokenMsg = 'Line: ' + token[0] + ', Column: ' + token[1] + '.';
	} else {
		tokenMsg = 'Line: ' + token.position[0] + ', Column: ' + token.position[1] + ' @ Symbol: "' + token.symbol + '" (' + token.class + ': ' + token.type + ').';
	}

	let err = errorList.find(function(el){
		return el.alias === alias;
	});

	//TODO: implement stack trace
	console.error(err.scope + ' error ' + err.code + ': ' + err.message + '\n' + tokenMsg);
};

