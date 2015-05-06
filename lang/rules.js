/**
 * The rules for building the language as a JSON-ish object.
 * @module lang/rules
 */

/**
 * The language rules model.
 * @typedef {Object} LanguageRules
 * @proprety {Object[]} types - An array of the types existing in the language.
 * @property {String} types[].name - The name of the type.
 * @property {String} types[].class - The class of the type.
 * @property {RegExp} types[].rule - The evaluation rule for the given type.
 * @property {Object[]} scopeDelimiters - The scope delimiters for the language.
 * @property {RegExp} scopeDelimiters[].startDelimiter - The evaluation rule for the start delimiter for that scope.
 * @property {RegExp} scopeDelimiters[].stopDelimiter - The evaluation rule for the stop delimiter for the given scope.
 * @property {String} scopeDelimiters[].scope - The scope name.
 * @property {RegExp} wordDelimiters - The evaluation rule for the word delimiters.
 * @property {Object[]} errors - The errors defined for the language.
 * @property {String} errors[].code - The error code.
 * @property {String} errors[].message - The error message.
 * @property {String} errors[].scope - The error scope.
 */

//TODO: add BNF like representation of the rules for inerpolation and/or use, maybe functions?
module.exports = {
	'types': [
		{
			'name': 'integer',
			'class': 'C3',
			'rule': /^\d+$/,
			'precedence': 1
		},
		{
			'name': 'float',
			'class': 'C6',
			'rule': /^\d*\.\d+$/,
			'precedence': 1
		},
		{
			'name': 'identifier',
			'class': 'C1',
			'rule': /^[a-z]+\w*$/,
			'precedence': 3
		},
		{
			'name': 'reservedWord',
			'class': 'C2',
			'rule': /^program|begin|end|var|real|integer|procedure|read|write|while|do|if|else|then$/,
			'precedence': 2
		},
		{
			'name': 'specialCharacter',
			'class': 'C4',
			'rule': /^<>|:=|<=|>=|\(|\)|\*|\/|-|\+|=|>|<|\$|\:|;|\,|\.$/,
			'precedence': 3
		},
		{
			'name': 'comments',
			'class': 'C5',
			'rule': /^\{.*?\}|\/\*.*?\*\/$/,
			'precedence': 4
		},
		{
			'name': 'whitespace',
			'class': 'C6',
			'rule': /^\s+$/,
			'precedence': 5
		},
		{
			'name': 'unknown',
			'class': 'C7',
			'rule': /.+?/,
			'precedence': 6
		}
	],
	'scopeDelimiters': [
		{
			'startDelimiter': /program/,
			'stopDelimiter': /\./,
			'scope': 'global',
			'precedence': 1
		},
		{
			'startDelimiter': /procedure[.\n]*begin/,
			'stopDelimiter': /end/,
			'scope': 'procedure',
			'precedence': 2
		},
		{
			'startDelimiter': /begin/,
			'stopDelimiter': /end/,
			'scope': 'block',
			'precedence': 3
		}
	],
	'syntaxRules': function(api){
		return [
			{
				'name': '',
				'rule': /.*?/,
				'fn': function(){

				}
			}
		];
	},
	//Organized list of all the above tests so that the tokenizer has less work to do in classifying the tokens, but may be slower than char-by-chat testing
	'wordDelimiters': /\{.*?\}|\/\*.*?\*\/|program|begin|end|var|real|integer|procedure|read|write|while|do|if|else|then|\d*\.\d+|\d+|<>|:=|<=|>=|\(|\)|\*|\/|-|\+|=|>|<|\$|\:|;|,|\.|[a-z]+\w*|\s+|.+?/ig,
	//TODO: implement errors
	'errors': [
		//File errors
		{
			'code': '001',
			'alias': 'file not found',
			'message': 'File not found.',
			'scope': 'File'
		},
		{
			'code': '002',
			'alias': 'cant open file',
			'message': 'Can\'t open file.',
			'scope': 'File'
		},
		{
			'code': '003',
			'alias': 'empty source code',
			'message': 'Empty source code.',
			'scope': 'Lexical'
		},
		//Tokenizer errors
		{
			'code': '004',
			'alias': 'source dont contain tokens',
			'message': 'Source conde don\'t contain any token.',
			'scope': 'Lexical'
		},
		{
			'code': '005',
			'alias': 'unknown token',
			'message': 'This token is unknown.',
			'scope': 'Lexical'
		},
		//Scopifyer errors
		{
			'code': '006',
			'alias': 'not starting in global scope',
			'message': 'Not starting in global scope.',
			'scope': 'Syntax'
		},
		{
			'code': '007',
			'alias': 'scope ending before starting',
			'message': 'Scope ending before starting.',
			'scope': 'Syntax'
		},
	]
};