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

// dependencies
if (currentPackage.json['require']){
    Object.keys(currentPackage.json['require']).forEach(function (dependencyName) {
        let version = currentPackage.json['require'][dependencyName];
        $.getElementById('package-dependencies').innerHTML += '<li>' + dependencyName + ': ' + version + '</li>';
    });
}
if (currentPackage.json['require-dev']){
    Object.keys(currentPackage.json['require-dev']).forEach(function (dependencyName) {
        let version = currentPackage.json['require-dev'][dependencyName];
        $.getElementById('package-dev-dependencies').innerHTML += '<li>' + dependencyName + ': ' + version + '</li>';
    });
}

let elOutput = document.getElementById('composer-output');

utils.$onClick('action-composer-update', (e) => {
	elOutput.innerHTML = '';
	var elIcon = utils.findButtonicon(e.srcElement);
	elIcon.classList.remove('hidden');

	const update = composer.update(currentPackage.__get('name'));
	update.on('close', (code) => {
		elIcon.classList.add('hidden');
	});
	update.on('error', (data) => {
		elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
	});
	utils.outputReadLine(update.stdout, 'log--output', elOutput);
	utils.outputReadLine(update.stderr, 'log--output', elOutput);
});


utils.$onClick('action-composer-remove', (e) => {
	elOutput.innerHTML = '';
	var elIcon = utils.findButtonicon(e.srcElement);
	elIcon.classList.remove('hidden');

	const remove = composer.remove(currentPackage.getName());
	remove.on('close', (code) => {
		elIcon.classList.add('hidden');
	});
	remove.on('error', (data) => {
		elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
	});
	utils.outputReadLine(remove.stdout, 'log--output', elOutput);
	utils.outputReadLine(remove.stderr, 'log--output', elOutput);
});

utils.$onClick('action-composer-show', (e) => {
	elOutput.innerHTML = '';
	var elIcon = utils.findButtonicon(e.srcElement);
	elIcon.classList.remove('hidden');

	const show = composer.show(currentPackage.getName());
	console.log(show);
	show.on('close', (code) => {
		console.log(code);
		elIcon.classList.add('hidden');
	});
	show.on('error', (data) => {
		console.log(data);
		elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
	});
	utils.outputReadLine(show.stdout, 'log--output', elOutput);
	utils.outputReadLine(show.stderr, 'log--output', elOutput);
});
