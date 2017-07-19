'use strict';

var Package = function (json) {
	this.json = json;
	this.__get = (key) => { return this.json[key]};
	this.getVersion = () => { return this.json.version; };
	this.getName = () => { return this.json.name };
};
Package.prototype.json = {};
module.exports = Package;
