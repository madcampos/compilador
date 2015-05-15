/*global tokenList*/
/**
 * This module is responsible for generating the Abstract Syntax Tree
 * @module src/ast
 */

/* module.exports = function(tokenList){
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
};*/

module.exports = ruleProgram;
let error = require('./error');
let currentToken = 0;

function ruleProgram(tokenList){
	if (tokenList[currentToken].symbol === 'program') {
		currentToken++;
		if (tokenList[currentToken].type === 'identifier') {
			currentToken++;
			ruleBody();

			if (tokenList[currentToken].symbol !== '.') {
				error('expected .', tokenList[currentToken]);
			}
		} else {
			error('expected identifier', tokenList[currentToken]);
		}
	} else {
		error('expected program', tokenList[currentToken]);
	}
}

function ruleBody(){
	ruleDc();
	if (tokenList[currentToken].symbol === 'begin') {
		currentToken++;
		ruleCommand();

		if (tokenList[0].symbol === 'end') {
			currentToken++;
		} else {
			error('expected end', tokenList[currentToken]);
		}
	} else {
		error('expected begin', tokenList[currentToken]);
	}
}

function ruleDc(){
	if (tokenList[currentToken].symbol === 'var') {
		currentToken++;
		ruleVarDc();
	} else if (tokenList[currentToken].symbol === 'procedure') {
		currentToken++;
		ruleProcedureDc();
	}

	if (tokenList[currentToken].symbol === ';') {
		currentToken++;
		ruleDc();
	} else {
		error('expected ;', tokenList[currentToken]);
	}
}

function ruleVarDc(){
	if (tokenList[currentToken].type === 'identifier') {
		currentToken++;
		if (tokenList[currentToken].symbol === ',') {
			currentToken++;
			ruleVarDc();
		} else if (tokenList[currentToken].symbol === ':') {
			currentToken++;
			ruleVarType();
		} else {
			error('expected , or :', tokenList[currentToken]);
		}
	} else {
		error('expected identifier', tokenList[currentToken]);
	}
}

function ruleVarType(){
	if (tokenList[currentToken].symbol === 'real') {
		//TODO: type bind
	} else if (tokenList[currentToken].symbol === 'integer') {
		//TODO: type bind
	} else {
		error('expected type declaration', tokenList[currentToken]);
	}

	currentToken++;
}

function ruleProcedureDc(){
	if (tokenList[currentToken].type === 'identifier') {
		//TODO: increment scope
		currentToken++;
		ruleParam();
		ruleProcedureBody();
	} else {
		error('expected identifier', tokenList[currentToken]);
	}
}

function ruleProcedureBody(){
	if (tokenList[currentToken].symbol === 'var') {
		//TODO: associate vars with scope
		currentToken++;
		ruleVarDc();

		if (tokenList[currentToken].symbol === ';') {
			currentToken++;
			ruleProcedureBody();
		}
	}

	if (tokenList[currentToken].symbol === 'begin') {
		ruleBody();
	} else {
		error('expected procedure body', tokenList[currentToken]);
	}
}

function ruleParam(){
	//TODO: associate params with scope
	if (tokenList[currentToken].symbol === '(') {
		currentToken++;
		if (tokenList[currentToken].type === 'identifier') {
			ruleParamList();
		}

		if (tokenList[currentToken].symbol === ')') {
			currentToken++;
		} else {
			error('expected )', tokenList[currentToken]);
		}
	} else {
		error('expected (', tokenList[currentToken]);
	}
}

function ruleParamList(){
	ruleVarDc();
	if (tokenList[currentToken].symbol === ';') {
		 currentToken++;
		ruleParamList();
	}
}

function ruleCommand(){

	switch(tokenList[currentToken].symbol){
		case 'read':
			currentToken++;
			ruleRead();
			break;
		case 'write':
			currentToken++;
			ruleWrite();
			break;
		case 'while':
			currentToken++;
			ruleWhile();
			break;
		case 'if':
			currentToken++;
			ruleIf();
			break;
		case ';':
			currentToken++;
			ruleCommand();
			break;
	}

	if (tokenList[currentToken].type === 'identifier') {
		ruleIdentCall();
	}
}

function ruleRead(){
	ruleParam();
}

function ruleWrite(){
	ruleParam();
}
function ruleWhile(){
	ruleCondition();
	if (tokenList[currentToken].symbol === 'do') {
		currentToken++;
		ruleCommand();

		if (tokenList[currentToken].symbol === '$') {
			currentToken++;
		} else {
			error('expected $', tokenList[currentToken]);
		}
	} else {
		error('expected do', tokenList[currentToken]);
	}
}
function ruleIf(){
	ruleCondition();
	if (tokenList[currentToken].symbol === 'then') {
		currentToken++;
		ruleCommand();
		ruleElse();

		if (tokenList[currentToken].symbol === '$') {
			currentToken++;
		} else {
			error('expected $', tokenList[currentToken]);
		}
	} else {
		error('expected then', tokenList[currentToken]);
	}
}
function ruleElse(){
	if (tokenList[currentToken].symbol === 'else') {
		currentToken++;
		ruleCommand();
	}
}

function ruleCondition(){
	ruleExpression();
	ruleRelation();
	ruleExpression();
}

function ruleExpression(){

}

function ruleRelation(){
	switch (tokenList[currentToken].symbol) {
		case '=':
		case '<>':
		case '>=':
		case '<=':
		case '>':
		case '<':
			currentToken++;
	}
}

function ruleIdentCall(){
	if (tokenList[currentToken].symbol === ':=') {
		currentToken++;
		ruleExpression();
	} else {
		ruleArgList();
	}
}

function ruleArgList(){
	if (tokenList[currentToken].symbol === '(') {
		currentToken++;
		ruleArg();

		if (tokenList[currentToken].symbol === ')') {
			currentToken++;
		} else {
			error('expected )', tokenList[currentToken]);
		}
	}
}

function ruleArg(){
	if (tokenList[currentToken].type === 'identifier'){
		currentToken++;
		if (tokenList[currentToken].symbol === ';') {
			currentToken++;
			ruleArg();
		}
	} else {
		error('expected identifier', tokenList[currentToken]);
	}
}
