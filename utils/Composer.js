'use strict';

/**
 *
 * @param {String} projectPath
 * @param {String} appPath
 * @constructor
 */
let Composer = function(projectPath, appPath) {
	let exec = require('child_process').exec;
	let bin = appPath + '/composer.phar';

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
	this._runCommand = (command, opts, callback) => {
		opts['cwd'] = this.path;
		console.log(command);
		exec(command, opts, callback)
	}
};
Composer.prototype.path = '';
Composer.prototype.require = (dependency, opts) => {

};
Composer.prototype.remove = (dependency, opts) => {

};
Composer.prototype.cleanUpOutput = (output) => {
	if (output.length > 0 && typeof output === 'string') {
		return output.replace('You are running composer with xdebug enabled. This has a major impact on runtime performance. See https://getcomposer.org/xdebug', '');
	}
	return output;
};
module.exports = Composer;
