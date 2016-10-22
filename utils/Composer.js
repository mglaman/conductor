'use strict';

/**
 *
 * @param {String} path
 * @constructor
 */
let Composer = function(path) {
	this.path = path;
	this.install = (opts, callback) => {
		opts['cwd'] = this.path;
		require('child_process').exec('composer install --no-progress', opts, callback);
	};
	this.update = (dependency, opts, callback) => {
		var command = 'composer update --no-progress';
		if (typeof dependency === 'string') {
			command += ' ' + dependency;
		}
		opts['cwd'] = this.path;
		require('child_process').exec(command, opts, callback);
	};
	this.validate = (opts, callback) => {
		opts['cwd'] = this.path;
		require('child_process').exec('composer validate', opts, callback);
	};
	this.show = (dependency, opts, callback) => {
		opts['cwd'] = this.path;
		require('child_process').exec('composer show ' + dependency, opts, callback);
	};
	this.remove = (dependency, opts, callback) => {
		opts['cwd'] = this.path;
		require('child_process').exec('composer remove ' + dependency, opts, callback);
	};
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
