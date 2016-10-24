
exports.$addEventListener = (elId, event, callback) => {
	document.getElementById(elId).addEventListener(event, callback);
};
exports.$onClick = (elId, callback) => {
	this.$addEventListener(elId, 'click', callback);
};
