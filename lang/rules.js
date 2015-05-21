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
	'wordDelimiters': /\{.*?\}|\/\*.*?\*\/|program|begin|end|var|real|integer|procedure|read|write|while|do|if|else|then|\d*\.\d+|\d+|<>|:=|<=|>=|\(|\)|\*|\/|-|\+|=|>|<|\$|\:|;|,|\.|[a-z]+\w*|\s+|.+?/ig,
	'errors': [
		//Erros de arquivo
		{
			'code': 1,
			'alias': 'arquivo não encontrado',
			'message': 'Arquivo não encontrado.',
			'scope': 'Arquivo'
		},
		{
			'code': 2,
			'alias': 'impossivel abrir arquivo',
			'message': 'Impossivel abrir arquivo.',
			'scope': 'Arquivo'
		},
		{
			'code': 3,
			'alias': 'código vazio',
			'message': 'Código fonte vazio.',
			'scope': 'Arquivo'
		},
		//Erros léxicos
		{
			'code': 4,
			'alias': 'código sem tokens',
			'message': 'O código fonte não contem tokens.',
			'scope': 'Léxico'
		},
		{
			'code': 5,
			'alias': 'token desconhecido',
			'message': 'Token desconhecido.',
			'scope': 'Léxico'
		},
		//Erros sintáticos
		{
			'code': 6,
			'alias': 'programa precisa começar com program',
			'message': 'O programa precisa começar com a palavra reservada "program".',
			'scope': 'Sintático'
		},
		{
			'code': 7,
			'alias': 'program precisa ser seguida de um identificador',
			'message': 'A declaração do programa necessita um identificado depois da palavra "program".',
			'scope': 'Sintático'
		},
		{
			'code': 8,
			'alias': 'programa deve terminar com um .',
			'message': 'O programa deve terminar com o caracter "."',
			'scope': 'Sintático'
		},
		{
			'code': 9,
			'alias': 'bloco de comandos deve começar com begin',
			'message': 'Um bloco de comandos deve começar com a palavra reservada "begin".',
			'scope': 'Sintático'
		},
		{
			'code': 10,
			'alias': 'bloco de comandos deve terminar com end',
			'message': 'Um bloco de comandos deve terminar com a palavra reservada "end".',
			'scope': 'Sintático'
		},
		{
			'code': 11,
			'alias': 'esperado uma lista de identificadores',
			'message': 'Era esperado uma lista de identificadores aqui.',
			'scope': 'Sintático'
		},
		{
			'code': 12,
			'alias': 'esperado o caracter :',
			'message': 'Era esperado o caracter ":" depois da listavem dos identificadores.',
			'scope': 'Sintático'
		},
		{
			'code': 13,
			'alias': 'esperado uma definição de tipo',
			'message': 'Era esperado uma definição de tipo ("integer" ou "real").',
			'scope': 'Sintático'
		},
		{
			'code': 14,
			'alias': 'procedure deve ser acompanhado de identificador',
			'message': 'A palavra reservada procedure deve ser acompanhada de um identificador.',
			'scope': 'Sintático'
		},
		{
			'code': 15,
			'alias': 'parâmetros devem começar com (',
			'message': 'A lista de parâmetros deve começar com o caracter "(".',
			'scope': 'Sintático'
		},
		{
			'code': 16,
			'alias': 'parâmetros devem terminar com )',
			'message': 'A lista de parâmetros deve terminar com o caracter ")".',
			'scope': 'Sintático'
		},
		{
			'code': 17,
			'alias': 'procedimentos não podem ser declarados localmente',
			'message': 'Procedimentos não podem ser declarados dentro de outros procedimentos.',
			'scope': 'Sintático'
		},
		{
			'code': 18,
			'alias': 'argumentos devem começar com (',
			'message': 'A lista de argumentos deve começar com o caracter "(".',
			'scope': 'Sintático'
		},
		{
			'code': 19,
			'alias': 'argumentos devem terminar com )',
			'message': 'A lista de argumentos deve terminar com o caracter ")".',
			'scope': 'Sintático'
		},
		{
			'code': 18,
			'alias': '',
			'message': '',
			'scope': 'Sintático'
		},
	]
};
