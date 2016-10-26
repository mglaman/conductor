const utils = require('../../utils/misc');
const fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./main');
const thisWindow = remote.getCurrentWindow();
const Composer = require('../../utils/Composer');

let currentPackage = mainProcess.getViewingPackage();
let composer = new Composer(mainProcess.getActiveProject().getPath());
thisWindow.setTitle(currentPackage.json.name);

let $ = document;

$.getElementById('package-name').textContent = currentPackage.json.name;
$.getElementById('package-version').textContent = currentPackage.getVersion();
$.getElementById('package-homepage').textContent = currentPackage.json.homepage;
$.getElementById('package-description').textContent = currentPackage.json.description;

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

utils.$onClick('action-composer-update', (e) => {
	elOutput.value = '';
	var el = /** @type {Element} */ e.srcElement;
	var elIcon = el.childNodes[1];

	elIcon.classList.remove('hidden');
	composer.update(currentPackage.json.name, {}, (ex, stdout, stderr) => {
		composerOutputHandler(ex, stdout, stderr);
		elIcon.classList.add('hidden');
	});
});
utils.$onClick('action-composer-remove', (e) => {
	elOutput.value = '';
	var el = /** @type {Element} */ e.srcElement;
	var elIcon = el.childNodes[1];

	elIcon.classList.remove('hidden');
	composer.remove(currentPackage.json.name, {}, (ex, stdout, stderr) => {
		composerOutputHandler(ex, stdout, stderr);
		elIcon.classList.add('hidden');
	});
});
utils.$onClick('action-composer-show', (e) => {
	elOutput.value = '';
	var el = /** @type {Element} */ e.srcElement;
	var elIcon = el.childNodes[1];

	elIcon.classList.remove('hidden');
	composer.show(currentPackage.json.name, {}, (ex, stdout, stderr) => {
		composerOutputHandler(ex, stdout, stderr);
		elIcon.classList.add('hidden');
	});
});
