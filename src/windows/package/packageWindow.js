'use strict';

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

// Vue components
require('../../components/package-details');
require('../../components/package-composer-frame');

// Vue app
let vm = new Vue({
	el: '#app',
	data: {
		package: currentPackage,
	},
});

