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

utils.$onClick('project-destination', projectDestinationBrowse);
utils.$addEventListener('project-destination', 'onfocus', projectDestinationBrowse);

function projectDestinationBrowse() {
	let folder = dialog.showOpenDialog(thisWindow, {
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

	elOutput.innerHTML = '';
	var elIcon = utils.findButtonicon(e.srcElement);
	elIcon.classList.remove('hidden');

	const createProject = composer.createProject(packageName, projectDest);
	createProject.on('close', (code) => {
		console.log(code);
		elIcon.classList.add('hidden');
		if (code === 0 && fs.existsSync(projectDest + '/composer.json')) {
			mainProcess.fromNewProject(projectDest);
			thisWindow.close();
		}
	});
	createProject.on('error', (data) => {
		console.log(data);
		elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
	});
	utils.outputReadLine(createProject.stdout, 'log--output', elOutput);
	utils.outputReadLine(createProject.stderr, 'log--output', elOutput);
});
