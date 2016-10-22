'use strict';
var Package = function (json) {
	this.json = json;
	this.getVersion = () => { return this.json.version; }
};
Package.prototype.json = {};
module.exports = Package;
