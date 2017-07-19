'use strict';

const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./main');
const projectList = mainProcess.getProjectList().getList();

let vm = new Vue({
	el: '#app',
	data: {
		projects: projectList
	},
	methods: {
		openProject: (path) => {
			mainProcess.openProject(path);
		},
		openDirectory: () => {
			mainProcess.openDirectory();
		},
		createProject: () => {
			mainProcess.createProject();
		},
		globalProject: () => {
			mainProcess.openProject(remote.app.getPath('home') + '/.composer');
		}
	}
});
