'use strict';
let Lock = require('./Lock');
/**
 *
 * @param {String} path
 * @constructor
 */
let Project = function (path) {
	this.path = path;

	this.getPath = () => { return this.path };
	this.getName = () => { return this.json['name'] || '' };
	this.getDescription = () => { return this.json['description'] || '' };
	/**
	 * @returns {Object}
	 */
	this.getRequire = () => { return this.json['require'] };
	/**
	 * @returns {Object}
	 */
	this.getRequireDev = () => { return this.json['require-dev'] };
	/**
	 * @returns {*|string}
	 */
	this.getHomepage = () => { return this.json['homepage'] || '' };
	/**
	 * @returns {null|Lock}
	 */
	this.getLock = () => { return this.lock };

	/**
	 * Determine if a package is a development requirement
	 *
	 * @param name
	 * @returns {boolean}
	 */
	this.packageIsDev = (name) => {
		let dev = this.getRequireDev();
		return dev.hasOwnProperty(name);
	}

	this.refreshLock = () => {
		this.lock = null;
		if (this.filesystem.existsSync(path + '/composer.lock')) {
			try {
				this.filesystem.readFile(path + '/composer.lock', (err, data) => {
					if (!err) {
						this.lock = new Lock(JSON.parse(data));
					}
				});
			} catch (e) {
				console.log(e);
			}
		}
	};

	this.isInstalled = () => {
		return this.lock !== null;
	};

	this.refreshData = () => {
		this.json = require(this.path + '/composer.json');
		this.refreshLock();
	};
	this.refreshData();
};
Project.prototype.path = '';
Project.prototype.json = {};
Project.prototype.filesystem = require('fs');
module.exports = Project;
