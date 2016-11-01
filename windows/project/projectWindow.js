const utils = require('../../utils/misc');
const fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./main');
const thisWindow = remote.getCurrentWindow();
const Project = require('../../models/Project');
const Composer = require('../../utils/Composer');

let activeProject = mainProcess.getActiveProject();
let projectInstalled = activeProject.isInstalled();
let composer = new Composer(activeProject.getPath());

const renderDependencies = (elId, dev) => {
	var elDependencies = document.getElementById(elId);

	var projectDependencies = null;
	if (typeof dev === "boolean") {
		projectDependencies = activeProject.getRequireDev();
	} else {
		projectDependencies = activeProject.getRequire();
	}

	for (var key in projectDependencies) {
		if (!projectDependencies.hasOwnProperty(key)) {
			continue;
		}
		var item = document.createElement('li');
		item.setAttribute('data-package', key);
		item.appendChild(document.createTextNode(key));
		elDependencies.appendChild(item);
	}
};

thisWindow.setTitle(activeProject.getName());
document.getElementById('project-name').textContent = activeProject.getName();
document.getElementById('project-description').textContent = activeProject.getDescription();
if (typeof activeProject.getHomepage() == 'string') {
	document.getElementById('project-url').textContent = activeProject.getHomepage();
}

if (projectInstalled) {
	document.getElementById('project-composer-lock').classList.remove('hidden');
	document.getElementById('action-composer-update').classList.remove('hidden');
}

renderDependencies('project-dependencies');
renderDependencies('project-dev-dependencies', true);

const elOutput = document.getElementById('composer-output');

utils.$onClick('action-composer-install', (e) => {
	elOutput.innerHTML = '';
	var elIcon = utils.findButtonicon(e.srcElement);
	elIcon.classList.remove('hidden');

	const install = composer.install();
	install.on('close', (code) => {
		elIcon.classList.add('hidden');

		if (code === 0) {
			activeProject.refreshData();
			projectInstalled = activeProject.isInstalled();
			// @todo get some kind of binding to not need to do this.
			// thisWindow.reload();
		}
	});
	install.on('error', (data) => {
		elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
	});
	utils.outputReadLine(install.stdout, 'log--output', elOutput);
	// General step info gets sent to stderr, so we don't style it as an error.
	utils.outputReadLine(install.stderr, 'log--output', elOutput);
});

utils.$onClick('action-composer-update', (e) => {
	elOutput.innerHTML = '';
	var elIcon = utils.findButtonicon(e.srcElement);
	elIcon.classList.remove('hidden');

	const update = composer.update(null);
	update.on('close', (code) => {
		elIcon.classList.add('hidden');
	});
	update.on('error', (data) => {
		elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
	});
	utils.outputReadLine(update.stdout, 'log--output', elOutput);
	utils.outputReadLine(update.stderr, 'log--output', elOutput);
});


utils.$onClick('action-composer-validate', (e) => {
	elOutput.innerHTML = '';
	var elIcon = utils.findButtonicon(e.srcElement);
	elIcon.classList.remove('hidden');

	const validate = composer.validate();
	validate.on('close', (code) => {
		elIcon.classList.add('hidden');
	});
	validate.on('error', (data) => {
		elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
	});
	utils.outputReadLine(validate.stdout, 'log--output', elOutput);
	utils.outputReadLine(validate.stderr, 'log--output', elOutput);
});

document.querySelectorAll('.project__dependencies-list li').forEach(function (e) {
	if (projectInstalled) {
		let packageName = e.getAttribute('data-package');

		if (packageName != 'php' || packageName.indexOf('ext-') > -1) {
			e.addEventListener('click', function (eClick) {
				var packageName = eClick.srcElement.getAttribute('data-package');
				mainProcess.openPackage(packageName);
			});
		}
	}
});
