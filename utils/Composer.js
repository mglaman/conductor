'use strict';

/**
 *
 * @param {String} projectPath
 * @constructor
 */
let Composer = function(projectPath) {
	var bin = this.binPath + '/composer.phar';

	this.install = (opts) => {
		return this._runCommand(['install', '--no-progress'], opts);
	};
	this.update = (dependency, opts) => {
		let command = ['update', '--no-progress'];
		if (typeof dependency === 'string') {
			command.push(dependency);
		}
		return this._runCommand(command, opts);
	};
	this.validate = (opts) => {
		return this._runCommand(['validate'], opts);
	};
	/**
	 *
	 * @param dependency
	 * @param opts
	 * @returns {ChildProcess}
	 */
	this.show = (dependency, opts) => {
		return this._runCommand(['show', dependency], opts);
	};
	this.remove = (dependency, opts) => {
		return this._runCommand(['remove', dependency], opts);
	};
	this.createProject = (project, destination, opts) => {
		return this._runCommand(['create-project', project, destination,'--stability', 'dev', '--no-interaction'], opts)
	};
	this._normalizeOpts = (opts) => {
		if (typeof opts === 'undefined' || opts.length === 0) {
			opts = {};
		}
		opts['cwd'] = projectPath;
		return opts;
	};
	/**
	 *
	 * @param command
	 * @param opts
	 * @returns {ChildProcess}
	 * @private
	 */
	this._runCommand = (command, opts) => {
		opts = this._normalizeOpts(opts);
		return this.spawn(bin, command, opts);
	}
};

Composer.prototype.spawn = require('child_process').spawn;
Composer.prototype.binPath = (process.mainModule.filename.indexOf('app.asar') !== -1) ? process.resourcesPath : process.cwd();
module.exports = Composer;
