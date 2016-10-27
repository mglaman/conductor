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

let elOutput = document.getElementById('composer-output');

let composerOutputHandler = (error, stdout, stderr) => {
	if (error !== null) {
		elOutput.value = composer.cleanUpOutput(error);
	} else {
		if (stdout.length > 0) {
			elOutput.value += composer.cleanUpOutput(stdout);
		}
		if (stderr.length > 0) {
			elOutput.value += composer.cleanUpOutput(stderr);
		}
	}
};

utils.$onClick('action-composer-install', (e) => {
	elOutput.value = '';
	var el = /** @type {Element} */ e.srcElement;
	var elIcon = el.childNodes[1];

	elIcon.classList.remove('hidden');
	composer.install({}, (error, stdout, stderr) => {
		composerOutputHandler(error, stdout, stderr);
		elIcon.classList.add('hidden');
		activeProject.refreshData();
		projectInstalled = activeProject.isInstalled();

		if (error === null) {
			thisWindow.reload();
		}
	});
});

utils.$onClick('action-composer-update', (e) => {
	elOutput.value = '';
	var el = /** @type {Element} */ e.srcElement;
	var elIcon = el.childNodes[1];

	elIcon.classList.remove('hidden');
	composer.update(null, {}, (error, stdout, stderr) => {
		composerOutputHandler(error, stdout, stderr);
		elIcon.classList.add('hidden');
	});
});

utils.$onClick('action-composer-validate', (e) => {
	elOutput.value = '';
	var el = /** @type {Element} */ e.srcElement;
	var elIcon = el.childNodes[1];

	elIcon.classList.remove('hidden');
	composer.validate({}, (error, stdout, stderr) => {
		composerOutputHandler(error, stdout, stderr);
		elIcon.classList.add('hidden');
	});
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
