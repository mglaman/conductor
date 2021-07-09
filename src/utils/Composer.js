'use strict';

/**
 *
 * @param {String} projectPath
 * @constructor
 */
let Composer = function(projectPath) {
	const bin = this.binPath + '/composer.phar';

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
	this.remove = (dependency, dev = false, opts) => {
		let command = ['remove'];
		if (dev){
			command.push('--dev');
		}
		command.push(dependency);
		return this._runCommand(command, opts);
	};
	this.createProject = (project, destination, opts) => {
		return this._runCommand(['create-project', project, destination,'--stability', 'dev', '--no-interaction'], opts)
	};

	/**
	 * Initialize a new project within an existing folder
	 *
	 * @param destination String
	 * @param project Object
	 * @param opts Object
	 * @returns {ChildProcess|*}
	 */
	this.initProject = (destination, project, opts) => {
		let command = [
			'init',
			'--name', project.name,
			'--description', project.description,
			'--author', project.author,
			'--type', project.type,
			'--stability', project.stability,
		];
		if (project.license){
			command.push('--license');
			command.push(project.license);
		}
		command.push('--no-interaction');

		opts = this._normalizeOpts(opts);
		opts.cwd = destination;
		return this.spawn(bin, command, opts);
	}

	/**
	 * Add a requirement to a project
	 *
	 * @param requirement String
	 * @param dev Boolean
	 * @param opts Object
	 * @returns {ChildProcess}
	 */
	this.require = (requirement, dev = false, opts) => {
		let command = ['require'];
		if (dev){
			command.push('--dev');
		}
		command.push(requirement);

		return this._runCommand(command, opts);
	}

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
