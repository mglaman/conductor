'use strict';

/**
 *
 * @param {String} projectPath
 * @param {String} appPath
 * @constructor
 */
let Composer = function(projectPath) {
	let bin = null;

	if (!this.isAsar) {
		bin = process.cwd() + '/composer.phar';
	} else {
		bin = this.resourcesPath + '/composer.phar';
	}

	this.path = projectPath;
	this.install = (opts, callback) => {
		this._runCommand(bin + ' install --no-progress', opts, callback);
	};
	this.update = (dependency, opts, callback) => {
		var command = bin + ' update --no-progress';
		if (typeof dependency === 'string') {
			command += ' ' + dependency;
		}
		this._runCommand(command, opts, callback);
	};
	this.validate = (opts, callback) => {
		this._runCommand(bin + ' validate', opts, callback);
	};
	this.show = (dependency, opts, callback) => {
		this._runCommand(bin + ' show ' + dependency, opts, callback);
	};
	this.remove = (dependency, opts, callback) => {
		this._runCommand(bin + ' remove ' + dependency, opts, callback);
	};
	this.createProject = (project, destination, opts, callback) => {
		this._runCommand(bin + ' create-project ' + project + ' ' + destination + ' --stability dev', opts, callback)
	};
	this._runCommand = (command, opts, callback) => {
		opts['cwd'] = this.path;
		console.log(command);
		this.exec(command, opts, callback)
	}
};
Composer.prototype.exec = require('child_process').exec;
Composer.prototype.path = '';
Composer.prototype.isAsar = process.mainModule.filename.indexOf('app.asar') !== -1;
Composer.prototype.resourcesPath = process.resourcesPath;
Composer.prototype.cleanUpOutput = (output) => {
	if (output.length > 0 && typeof output === 'string') {
		return output.replace('You are running composer with xdebug enabled. This has a major impact on runtime performance. See https://getcomposer.org/xdebug', '');
	}
	return output;
};
module.exports = Composer;
