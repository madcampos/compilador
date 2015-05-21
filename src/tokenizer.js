let error = require('./error');
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

let initialized = false;

Object.defineProperty(Array.prototype, 'lastElement', {
	get: function(){
		return this[this.lastIndex];
	},
	set: function(el){
		this[this.lastIndex] = el;
	},
	enumerable: false
});

Object.defineProperty(Array.prototype, 'lastIndex', {
	get: function(){
		return this.length -1;
	},
	enumerable: false
});

let token = {
	get symbol(){return tokenList.lastElement ? tokenList.lastElement.symbol : undefined;},
	get cls(){return tokenList.lastElement ? tokenList.lastElement.cls : undefined;},
	get type(){return tokenList.lastElement ? tokenList.lastElement.type : undefined;},
	get rule(){return tokenList.lastElement ? tokenList.lastElement.rule : undefined;},
	get position(){return currentPosition;}
};

Object.defineProperties(token, {
	tokenList: {
		get: function(){return tokenList;},
		enumerable: false
	},
	symbolTable: {
		get: function(){},
		enumerable: false
	},
	next: {
		value: function(){
			let type;

			if (rawList.length === 0) {
				return;
			}

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
		enumerable: false
	},
	setAttribute: {
		value: function(attribute, value, index){
			index = index || tokenList.lastIndex;
			tokenList[index][attribute] = value;
		},
		enumerable: false
	},
	getAttribute: {
		value: function(attribute, index){
			index = index || tokenList.lastIndex;
			if (tokenList[index].hasOwnProperty(attribute)) {
				return tokenList[index][attribute];
			}
		},
		enumerable: false
	},
	initialize: {
		value: function(source){
			if (initialized) {
				return;
			} else {
				initialized = true;
			}

			if (!source) {
				error('código vazio', null, null, null, true);
			}

			let delimiters = require('../lang/rules').wordDelimiters;
			rawList = source.match(delimiters);

			if (!rawList) {
				error('código sem tokens', null, null, null, true);
			}

			this.next();
		},
		enumerable: false
	},
	socpe: {
		value: {
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
		},
		enumerable: false
	}
});

Object.defineProperties(token.tokenList, {
	tokenInPosition: {
		value: function(pos){
			return tokenList[pos];
		},
		enumerable: false
	},
	currentPosition:{
		get: function(){
			return tokenList.lastIndex;
		},
		enumerable: false
	}
});

module.exports = token;
