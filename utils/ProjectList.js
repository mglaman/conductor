'use strict';

/**
 *
 * @param userDataDir
 * @constructor
 */
let ProjectList = function (userDataDir) {
	this.userDataDir = userDataDir;

	this.setList = (list) => {
		this.list = list;
	};
	this.getList = () => { return this.list; };

	this.refreshList = () => {
		this.setList(require(this.userDataDir + '/projects.json'));
	};

	// Ensure that the user directory exists and we have empty file.
	this.filesystem.exists(userDataDir + '/projects.json', (exists) => {
		if (!this.filesystem.existsSync(userDataDir)) {
			this.filesystem.mkdir(userDataDir)
		}
		if (!exists) {
			this.filesystem.writeFile(userDataDir + '/projects.json', '{}');
		}
	});

	this.refreshList();
};
ProjectList.prototype.list = {};
ProjectList.prototype.userDataDir = null;
ProjectList.prototype.filesystem = require('fs');
module.exports = ProjectList;
