const readline = require('readline');

exports.$addEventListener = (elId, event, callback) => {
	document.getElementById(elId).addEventListener(event, callback);
};
exports.$onClick = (elId, callback) => {
	this.$addEventListener(elId, 'click', callback);
};

const outputLogMessage = (message, lineClass) => {
	let p = document.createElement('p');
	p.classList.add(lineClass);
	p.innerText = message;
	return p;
};
exports.outputLogMessage = outputLogMessage;

exports.outputReadLine = (stream, lineClass, elOutput) => {
	readline.createInterface({
		input     : stream,
		terminal  : false
	}).on('line', line => {
		elOutput.appendChild(outputLogMessage(line, lineClass));
	});
};

exports.findButtonicon = (el) => {
	return el.childNodes[1];
};
