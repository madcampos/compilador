let errorDefinitions = require('../lang/rules').errors;
function CompilerError(msg, code, type, token, stack, next, abort){
	this.token = token || {symbol: '', position: {line: 0, column: 0}};
	this.name  = type;
	this.code = code;
	this.msg = `Erro de ${type} - [${token.position.line},${token.position.column}]: ${msg}
Token afetado: "${token.symbol}".`;

	if (stack) {
		this.msg += '\n' + stack;
	}

	if (next) {
		next();
	}

	if (abort) {
		process.exit();
	}
}
CompilerError.prototype = Object.create(Error.prototype);
CompilerError.prototype.constructor = CompilerError;

function error(msg, token, stack, next, abort){
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

	throw new CompilerError(err.message, err.code, err.scope, token, stack, next, abort);
}

module.exports = error;
