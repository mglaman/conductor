const fs = require('fs');
const electron = require('electron');
const Project = require('./src/models/Project');
const ProjectList = require('./src/utils/ProjectList');
const BrowserWindowFactory = require('./src/utils/BrowserWindowFactory');
const AppMenu = require('./src/utils/AppMenu');
const AppUpdater = require('./src/utils/AppUpdater');
const app = electron.app;
const dialog = electron.dialog;

let windowIcon = __dirname + '/build/icons/icon.svg';
let projectList = new ProjectList();
let mainWindow = null;
let wrapperWindow = null;
let projectWindow = null;
let packageWindow = null;
let createWindow = null;

/**
 * @type {Project}
 */
let activeProject = null;
let viewingPackage = null;



function createMainWindow() {
	mainWindow = BrowserWindowFactory.createWindow(`file://${__dirname}/src/windows/index.html`, 600, windowIcon);
	// mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

function createWrapperWindow(folder){
    try {
        activeProject = new Project(folder);
        wrapperWindow = BrowserWindowFactory.createWindow(`file://${__dirname}/src/windows/wrapper/wrapper.html`, 800, windowIcon);
        //wrapperWindow.webContents.openDevTools();
        wrapperWindow.on('show', () => {
				if (mainWindow !== null) {
				mainWindow.close();
			}
		});
        wrapperWindow.on('closed', () => {
            //activeProject = null;
        	//projectWindow = null;
			if (mainWindow === null) {
				createMainWindow();
			}
		});
    } catch (e) {
        console.error(e);
        dialog.showMessageBox({
            'type': 'error',
            'buttons': [],
            'message': 'There is was an error parsing the composer.json'
        });
    }
}

function createCreateWindow() {
	mainWindow.close();
	createWindow = BrowserWindowFactory.createWindow(`file://${__dirname}/src/windows/create/create.html`, 600, windowIcon);
	// createWindow.webContents.openDevTools();
	createWindow.on('closed', () => {
		refreshProjectList();
		activeProject = null;
		projectWindow = null;
		createWindow = null;
		createMainWindow();
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	refreshProjectList();

	AppMenu.setProjects(projectList.getList());
	AppMenu.setMenu();
	createMainWindow();
	new AppUpdater();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', function () {
	if (mainWindow === null && projectWindow === null) {
		createMainWindow()
	}
});

exports.fromNewProject = function (folder) {
	const composerJson = require(folder + '/composer.json');
	projectList.addProject(folder, composerJson.name);
	// createProjectWindow(folder);
};

const openDirectory = function () {
	let folder = dialog.showOpenDialog(mainWindow, {
		properties: ['openDirectory'],
	});
	if (!folder) {
		return;
	}
	fs.exists(folder + '/composer.json', function (exists) {
		if (exists) {
			const composerJson = require(folder + '/composer.json');
			projectList.addProject(folder, composerJson.name);
			createWrapperWindow(folder[0]);
		} else {
			dialog.showMessageBox(mainWindow, {
				'type': 'error',
				'buttons': [],
				'message': 'There is no composer.json in that directory'
			});
		}
	});
};
exports.openDirectory = openDirectory;

const openProject = function (path) {
	createWrapperWindow(path);
};
exports.openProject = openProject;

/**
 * @returns {Project}
 */
const getActiveProject = () => {
	return activeProject;
};
exports.getActiveProject = getActiveProject;

const refreshProjectList = () => {
	try {
		projectList.refreshList();
	} catch (e) {
		// This has issues when first run, or JSON missing.
	}
};
exports.refreshProjectList = refreshProjectList;

const getProjectList = () => {
	return projectList;
};
exports.getProjectList = getProjectList;

/**
 * @returns {Package}
 */
const getViewingPackage = () => {
	return viewingPackage;
};
exports.getViewingPackage = getViewingPackage;

const createProject = () => {
	createCreateWindow();
};
exports.createProject = createProject;
