'use strict';

Object.defineProperty(Array.prototype, 'lastElement', {
	get: function(){
		return this[this.lastIndex];
	},
	set: function(el){
		this[this.lastIndex] = el;
	}
});
Object.defineProperty(Array.prototype, 'lastIndex', {
	get: function(){
		return this.length -1;
	}
});

let token = (function(){
	let tokenList = [];
	let rawList = [];
	let currentPosition = {
		column: 1,
		line: 1
	};
	let types = require('../lang/rules').types;
	let currentScope = 0;
	let scopeList  = [];
	let scopeStack = [0];

	return {
		get(){
			return tokenList.lastElement;
		},
		get symbol(){
			return tokenList.lastElement.symbol;
		},
		get cls(){
			return tokenList.lastElement.cls;
		},
		get type(){
			return tokenList.lastElement.type;
		},
		get rule(){
			return tokenList.lastElement.rule;
		},
		next: function(){
			let type;

			type = types.find(function(el){
				return el.rule.test(rawList[tokenList.length]);
			});

			tokenList.push({
				symbol: rawList[tokenList.length],
				cls: type.class,
				rule: type.rule,
				type: type.name
			});

			if (tokenList.lastElement.symbol === '\n') {
				currentPosition.line++;
			}
			currentPosition.column += tokenList.lastElement.symbol.length;
		},
		get position(){
			return currentPosition;
		},
		tokenList:{
			get(){
				return tokenList;
			},
			tokenInPosition: function(pos){
				return tokenList[pos];
			},
			get currentPosition(){
				return tokenList.lastIndex;
			}
		},
		get symbolTable(){

		},
		setAttribute: function(attribute, value, index){
			index = index || tokenList.lastIndex;
			tokenList[index][attribute] = value;
		},
		getAttribute: function(attribute, index){
			index = index || tokenList.lastIndex;
			if (tokenList[index].hasOwnProperty(attribute)) {
				return tokenList[index][attribute];
			}
		},
		init: function(list){
			rawList = list;
			this.next();
		},
		generateAST: function(){
			programa();
		},
		socpe: {
			increment: function(startDelimiter, identifier){
				currentScope++;
				scopeStack.push(currentScope);

				scopeList.push({
					identifier: identifier,
					startDelimiter: startDelimiter,
					stack: scopeStack.slice()
				});
			},
			decrement: function(endDelimiter){
				currentScope--;
				scopeStack.pop();

				scopeList.lastElement.endDelimiter = endDelimiter;
			}
		}
	};
})();

let error = (function(){
	let errorDefinitions = require('../lang/rules').errors;
	function CompilerError(msg, code, type, tkn, stack, next){
		tkn = tkn || token;
		this.name  = type;
		this.code = code;
		this.msg = `Erro de ${type} - [${tkn.position.line},${tkn.position.column}]: ${msg}
Token afetado: "${tkn.symbol}".`;

		if (stack) {
			this.msg += '\n' + stack;
		}

		if (next) {
			next();
		}
	}
	CompilerError.prototype = Object.create(Error.prototype);
	CompilerError.prototype.constructor = CompilerError;

	return function(msg, token, stack, next){
		let err = errorDefinitions.find(function(el){
			return el.alias === msg;
		});

		if (!err) {
			err = {
				message: msg,
				alias: msg,
				scope: 'GERADO',
				code: errorDefinitions[errorDefinitions.length - 1].code + 1
			};
			errorDefinitions.push(err);
		}

		throw new CompilerError(err.message, err.code, err.scope, token, stack, next);
	};
})();

function programa(){
	if (token.symbol === 'program') {
		token.next();
		if (token.type === 'identifier'){
			identificador();
			token.next();
			corpo();

			token.next();
			if(token.symbol !== '.') {
				error('programa deve terminar com um .');
			}
		} else {
			error('program precisa ser seguida de um identificador');
		}
	} else {
		error('programa precisa começar com program');
	}
}

function corpo(local){
	declaração(local);

	token.next();
	if (token.symbol === 'begin') {
		token.next();
		comandos();

		token.next();
		if (token.symbol !== 'end') {
			error('bloco de comandos deve terminar com end');
		}
	} else {
		error('bloco de comandos deve começar com begin');
	}
}

function declaração(local){
	switch (token.symbol) {
		case 'var':
			declaraçãoVar();
			break;
		case 'procedure':
			if (!local) {
				declaraçãoProc();
			} else {
				error('procedimentos não podem ser declarados localmente');
			}
			break;
		case ';':
			token.next();
			declaração();
			break;
	}
}

function declaraçãoVar(){
	//TODO: checagem de variáveis e tipos
	if (token.symbol === 'var') {
		token.next();
		identificadoresComTipo();
	}

	if (token.symbol === ';') {
		token.next();
		declaração();
	}
}

function listaIdent(){
	if (token.type === 'identifier') {
		identificador();
		token.next();
	} else if (token.symbol === ',') {
		token.next();
		listaIdent();
	} else {
		error('esperado uma lista de identificadores');
	}
}

function identificadoresComTipo(){
	listaIdent();
	if (token.symbol === ':') {
		token.next();
		tipoVar();
	} else {
		error('esperado o coaracter :');
	}
}

function tipoVar(){
	switch (token.type) {
		case 'integer':
			primitivoInteiro();
			break;
		case 'real':
			primitivoReal();
			break;
		default:
			error('esperado uma definição de tipo');
			break;
	}
}

function declaraçãoProc(){
	if (token.symbol === 'procedure') {
		token.next();
		if (token.type === 'identifier') {
			identificador();
			token.next();
			parâmetros();
			corpo(true);
		} else {
			error('procedure deve ser acompanhado de identificador');
		}
	}
}

function parâmetros(){
	if (token.symbol === '(') {
		token.next();
		listaPar();
		if (token.symbol === ')') {
			token.next();
		} else {
			error('parâmetros devem terminar com )');
		}
	} else {
		error('parâmetros devem começar com (');
	}
}

function listaPar(){
	if (token.symbol === ';') {
		token.next();
		listaPar();
	} else {
		identificadoresComTipo();
	}
}

function listaArg(){
	if (token.symbol === '(') {
		token.next();
		listaIdent();
		if (token.symbol === ')') {
			token.next();
		} else {
			error('argumentos devem terminar com )');
		}
	} else {
		error('argumentos devem começar com (');
	}
}

function comandos(){
	switch (token.symbol) {
		case 'read':
			token.next();
			listaArg();
			break;
		case 'write':
			token.next();
			listaArg();
			break;
		case 'if':
			token.next();
			condição();
			if (token.symbol === 'then') {
				token.next();
				comandos();

				if (token.symbol === 'else') {
					token.next();
					comandos();
				}

				if (token.symbol === '$'){
					token.next();
				} else {
					error('esperado $ depois do if');
				}
			} else {
				error('esperado then depois do if');
			}
			break;
		case 'while':
			token.next();
			condição();

			if (token.symbol === 'do') {
				token.next();
				comandos();

				if (token.symbol === '$'){
					token.next();
				} else {
					error('esperado $ depois do while');
				}
			} else {
				error('esperado do depois do while');
			}
			break;
		case ';':
			token.next();
			comandos();
			break;
		default:
			if (token.type === 'identifier') {
				//TODO: attribution or call
				token.next();
				if (token.symbol === ':=') {
					token.next();
					expressão();
				} else {
					listaArg();
				}
			}
	}
}

function condição(){
	expressão();
	relação();
	expressão();
}

function relação(){
	switch (token.symbol) {
		//TODO: implementar
		case '=':
		case '<>':
		case '>=':
		case '<=':
		case '>':
		case '<':
			token.next();
			break;
	}
}

function expressão(){
	expressãoPrecedente();
	if (token.symbol === ('+' || '-')) {
		token.next();
		expressãoPrecedente();
	}
}

function expressãoPrecedente(){
	termo();
	if (token.symbol === ('*' || '/')) {
		token.next();
		termo();
	}
}

function termo(){
	if (token.symbol === ('+' || '-')) {
		token.next();
	}

	switch (token.type) {
		case 'identifier':
			identificador();
			break;
		case 'real':
			primitivoReal();
			break;
		case 'integer':
			primitivoInteiro();
			break;
		default:
			if (token.symbol === '(') {
				token.next();
				expressão();
				if (token.symbol === ')') {
					token.next();
				} else {
					error('expressão devem terminar com )');
				}
			} else {
				error('expressão devem começar com (');
			}
	}
}

function identificador(){
	//TODO: implementar
}

function primitivoInteiro(){
	//TODO: implementar
}

function primitivoReal(){
	//TODO: implementar
}
