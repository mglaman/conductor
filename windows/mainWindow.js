'use strict';

const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./main');
const openProjectButton = document.getElementById('open-project');
openProjectButton.addEventListener('click', function () {
	mainProcess.openDirectory();
});
const createProjectButton = document.getElementById('new-project');
createProjectButton.addEventListener('click', function () {
	mainProcess.createProject();
});
const elProjectList = document.getElementById('project-list');
const projectList = mainProcess.getProjectList().getList();
for (let path in projectList) {
	if (!projectList.hasOwnProperty(path)) {
		continue;
	}
	const button = document.createElement('button');
	button.innerHTML = '<i class="fa fa-folder"></i> ' + projectList[path];
	button.setAttribute('data-folder', path);
	button.addEventListener('click', (e) => {
		/** @var {MouseEvent} click */
		mainProcess.openProject(e.srcElement.getAttribute('data-folder'));
	});
	const item = document.createElement('li');
	item.appendChild(button);
	elProjectList.appendChild(item);
}
