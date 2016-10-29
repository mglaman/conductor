'use strict';
const app = require('electron').app;
const fs = require('fs');

/**
 * @constructor
 */
let ProjectList = function() {
	let userDataDir = app.getPath('userData');
	// Ensure that the user directory exists and we have empty file.
	if (!this.filesystem.existsSync(userDataDir + '/projects.json')) {
		if (!this.filesystem.existsSync(userDataDir)) {
			this.filesystem.mkdir(userDataDir)
		}
		this.filesystem.writeFile(userDataDir + '/projects.json', '{}');
	}

	this.userDataDir = userDataDir;

	this.setList = (list) => {
		this.list = list;
	};
	this.getList = () => { return this.list; };

	this.refreshList = () => {
		if (this.filesystem.existsSync(this.userDataDir + '/projects.json')) {
			this.setList(require(this.userDataDir + '/projects.json'));
		} else {
			this.setList({});
		}
	};

	this.addProject = (dir, name) => {
		this.list[dir] = name;
		fs.writeFile(this.userDataDir + '/projects.json', JSON.stringify(this.list));
	};

	this.refreshList();
};
ProjectList.prototype.list = {};
ProjectList.prototype.userDataDir = null;
ProjectList.prototype.filesystem = require('fs');
module.exports = ProjectList;
