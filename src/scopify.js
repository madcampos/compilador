/**
 * Scopify a Token.
 * @module src/scopify
 */
let error = import('./error');

let scopeStack = [];
let scopeDelimiters = import('../lang/rules').scopeDelimiters;

/**
 * Find the current scope of the given token and the token stack to follow.
 * @param {Token} scopelessToken - A token without scope to be found the scope.
 * @returns {Scope[]} The token's scope stack.
 */
module.exports = function(scopelessToken) {
	//TODO: progress and regress scope stack
	let lastScope = scopeStack[scopeStack.length -1];
	let isDelimiter = false;
	scopeDelimiters.forEach(function(el){
		if (scopelessToken.symbol === el.stopDelimiter) {
			if (!lastScope) {
				error('not starting in global scope', scopelessToken);
			} else {
				if (lastScope.type !== el.scope) {
					error('scope ending before starting', scopelessToken);
				} else {
					scopeStack.pop();
					isDelimiter = 'stop';
				}
			}

		}

		if (scopelessToken.symbol === el.startDelimiter) {
			if (!lastScope && el.scope !== 'global') {
				error('not starting in global scope', scopelessToken);
			} else {
				/**
				 * Scope model definition.
				 * @typedef {Object} Scope
				 * @property {String} type - The scope type.
				 * @property {Token} startDelimiter - The token that starts the scope.
				 */
				scopeStack.push({
					type: el.scope,
					startDelimiter: scopelessToken
				});
				isDelimiter = 'start';
			}
		}
	});

	return {
		scopeStack: scopeStack,
		tokenScope: lastScope,
		isDelimiter: isDelimiter
	};
};