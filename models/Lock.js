'use strict';
const Package = require('./Package');
const Lock = function (json) {
	const self = this;
	this.json = json;

	Array.from(json.packages).forEach(function (item) {
		self.packages[item.name] = new Package(item);
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
	};
};
Lock.prototype.json = {};
Lock.prototype.packages = {};
module.exports = Lock;
