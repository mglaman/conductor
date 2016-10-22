'use strict';

const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./main');
var openProjectButton = document.getElementById('open-project');
openProjectButton.addEventListener('click', function () {
	mainProcess.openDirectory();
});
var elProjectList = document.getElementById('project-list');
var projectList = mainProcess.getProjectList();
for (var path in projectList) {
	if (!projectList.hasOwnProperty(path)) {
		continue;
	}
	var button = document.createElement('button');
	button.innerHTML = '<i class="fa fa-folder"></i> ' + projectList[path];
	button.setAttribute('data-folder', path);
	button.addEventListener('click', (e) => {
		/** @var {MouseEvent} click */
		mainProcess.openProject(e.srcElement.getAttribute('data-folder'));
	});
	var item = document.createElement('li');
	item.appendChild(button);
	elProjectList.appendChild(item);
}
