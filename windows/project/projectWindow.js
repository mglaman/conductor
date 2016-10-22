const fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./main');
const thisWindow = remote.getCurrentWindow();
const Project = require('../../models/Project');
const Composer = require('../../utils/Composer');

let activeProject = mainProcess.getActiveProject();
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

fs.exists(activeProject.getPath() + '/composer.lock', (exists) => {
	if (exists) {
		document.getElementById('project-composer-lock').style.display = 'inherit';
	}
});
renderDependencies('project-dependencies');
renderDependencies('project-dev-dependencies', true);

let elOutput = document.getElementById('composer-output');

let composerOutputHandler = (ex, stdout, stderr) => {
	if (ex !== null) {
		elOutput.value = composer.cleanUpOutput(ex);
	} else {
		if (stdout.length > 0) {
			elOutput.value += composer.cleanUpOutput(stdout);
		}
		if (stderr.length > 0) {
			elOutput.value += composer.cleanUpOutput(stderr);
		}
	}
};

document.getElementById('action-composer-install').addEventListener('click', (e) => {
	elOutput.value = '';
	var el = /** @type {Element} */ e.srcElement;
	var elIcon = el.childNodes[1];

	elIcon.classList.remove('hidden');
	composer.install({}, (ex, stdout, stderr) => {
		composerOutputHandler(ex, stdout, stderr);
		elIcon.classList.add('hidden');
	});
});
document.getElementById('action-composer-update').addEventListener('click', (e) => {
	elOutput.value = '';
	var el = /** @type {Element} */ e.srcElement;
	var elIcon = el.childNodes[1];

	elIcon.classList.remove('hidden');
	composer.update(null, {}, (ex, stdout, stderr) => {
		composerOutputHandler(ex, stdout, stderr);
		elIcon.classList.add('hidden');
	});
});
document.getElementById('action-composer-validate').addEventListener('click', (e) => {
	elOutput.value = '';
	var el = /** @type {Element} */ e.srcElement;
	var elIcon = el.childNodes[1];

	elIcon.classList.remove('hidden');
	composer.validate({}, (ex, stdout, stderr) => {
		composerOutputHandler(ex, stdout, stderr);
		elIcon.classList.add('hidden');
	});
});

document.querySelectorAll('.project__dependencies-list li').forEach(function (e) {
	e.addEventListener('click', function (eClick) {
		var packageName = eClick.srcElement.getAttribute('data-package');
		mainProcess.openPackage(packageName);
	});
});
