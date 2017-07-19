'use strict';
const Package = require('./Package');
const Lock = function (json) {
	const self = this;
	this.json = json;
	this.packages = [];
	this.packagesDev = [];

	Array.from(json.packages).forEach(function (item) {
		self.packages[item.name] = new Package(item);
	});
	Array.from(json['packages-dev']).forEach(function (item) {
		self.packagesDev[item.name] = new Package(item);
	});

	/**
	 *
	 * @param name
	 * @returns {Package}
	 */
	this.getPackage = (name) => {
		if (this.packages.hasOwnProperty(name)) {
			return this.packages[name];
		}
		else if (this.packagesDev.hasOwnProperty(name)){
			return this.packagesDev[name];
		}
	};
};
Lock.prototype.json = {};
Lock.prototype.packages = {};
module.exports = Lock;
