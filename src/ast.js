/**
 * This module is responsible for generating the Abstract Syntax Tree
 * @module src/ast
 */

module.exports = function(tokenList){
	let tree = {};
	let curentToken = {};

	let api = {
		grabToken: function(){
			curentToken++;
			return tokenList[curentToken-1];
		},
		matchRule: function(token){

		},
		checkType: function(typeIdentifier, literalValue){

		},
		coerse: function(firstLiteral, secondLiteral){

		},
		node: {
			siblings: function(){
				return curentToken.parent.children;
			},
			parent: function(){
				return curentToken.parent;
			},
			children: function(){
				return curentToken.children;
			},
			previousSibling: function(){

			},
			nextSibling: function(){

			},
			hasChildren: function(){
				return curentToken.children.length !== 0 ? false : true;
			},
			appendChild: function(){

			},
			insertBefore: function(){

			},
			insertAfter: function(){

			},
			remove: function(){

			}
		},
		error: import('./error')
	};

	let syntaxRules = import('../lang/rules').syntaxRules(api);
};