'use strict';
const Config = require('electron-config');

/**
 * @constructor
 */
let ProjectList = function() {
	/** @type {ElectronConfig} */
	const config = new Config();

	this.setList = (list) => { this.list = list; };
	this.getList = () => { return this.list; };

	this.refreshList = () => {
		this.setList({});
		if (config.has('projects')) {
			this.setList(config.get('projects'));
		}
	};

	this.addProject = (dir, name) => {
		this.list[dir] = name;
		config.set('projects', this.list);
	};

	this.removeProject = (dir) => {
		delete this.list[dir];
		config.set('projects', this.list);
	}

	this.refreshList();
};
ProjectList.prototype.list = {};
module.exports = ProjectList;
