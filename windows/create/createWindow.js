const utils = require('../../utils/misc');
const fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const dialog = remote.dialog;
const thisWindow = remote.getCurrentWindow();
const mainProcess = remote.require('./main');

const Composer = require('../../utils/Composer');
let composer = new Composer(electron.remote.app.getAppPath());
let elDestDir = document.getElementById('destination');
let elPackageName = document.getElementById('packageName');
let elProjectName = document.getElementById('projectName');
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

utils.$onClick('project-destination', projectDestinationBrowse);
utils.$addEventListener('project-destination', 'onfocus', projectDestinationBrowse);

function projectDestinationBrowse() {
	var folder = dialog.showOpenDialog(thisWindow, {
		properties: ['openDirectory'],
	});
	if (!folder) {
		elDestDir.value = '';
	}
	elDestDir.value = folder;
}

utils.$onClick('project-create', (e) => {
	let packageName = elPackageName.value;
	let projectDest = elDestDir.value + '/' + elProjectName.value;

	let opts = ['--no-interaction'];

	elOutput.value = '';
	var el = /** @type {Element} */ e.srcElement;
	var elIcon = el.childNodes[1];

	elIcon.classList.remove('hidden');
	composer.createProject(packageName, projectDest, opts, (error, stdout, stderr) => {
		composerOutputHandler(error, stdout, stderr);
		elIcon.classList.add('hidden');
		if (fs.existsSync(projectDest + '/composer.json')) {
			mainProcess.fromNewProject(projectDest);
			thisWindow.close();
		}
	});
});
