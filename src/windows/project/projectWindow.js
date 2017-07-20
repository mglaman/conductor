'use strict';

const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./main');
const thisWindow = remote.getCurrentWindow();
let activeProject = mainProcess.getActiveProject();

thisWindow.setTitle(activeProject.getName());

// Vue components
require('../../components/project-details');
require('../../components/project-dependencies-nav');
require('../../components/project-composer-files-nav');
require('../../components/project-composer-frame');

// Vue app
let vm = new Vue({
	el: '#app',
	data: {
		project: activeProject,
		dependencies: activeProject.getRequire(),
		dependenciesDev: activeProject.getRequireDev(),
	}
});
