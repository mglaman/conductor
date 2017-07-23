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
let windowSize = 1024;
let debug = false;
let projectList = new ProjectList();
let mainWindow = null;
let projectWindow = null;

/**
 * @type {Project}
 */
let activeProject = null;
let viewingPackage = null;

/**
 * Main window for the app
 */
function createMainWindow() {
	mainWindow = BrowserWindowFactory.createWindow(`file://${__dirname}/src/windows/index.html`, windowSize, windowIcon);
	if (debug) mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

/**
 * Open a project in a new window
 *
 * @param folder
 */
function createProjectWindow(folder) {
	try {
		activeProject = new Project(folder);
		projectWindow = BrowserWindowFactory.createWindow(`file://${__dirname}/src/windows/project/project.html`, windowSize, windowIcon);
		if (debug) projectWindow.webContents.openDevTools();

		projectWindow.on('show', () => {
			if (mainWindow !== null) {
				mainWindow.close();
			}
		});
		projectWindow.on('closed', () => {
			activeProject = null;
			projectWindow = null;
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

/**
 * Add a project to the ProjectsList from a chosen directory, then open that project
 * @param folder
 * @void
 */
const fromNewProject = function (folder) {
	const composerJson = require(folder + '/composer.json');
	projectList.addProject(folder, composerJson.name);
	createProjectWindow(folder);
};

/**
 * Open an existing project directory
 * @void
 */
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
			createProjectWindow(folder[0]);
		} else {
			dialog.showMessageBox(mainWindow, {
				'type': 'error',
				'buttons': [],
				'message': 'There is no composer.json in that directory'
			});
		}
	});
};

/**
 * Open a new window for a project
 * @param path
 * @void
 */
const openProject = function (path) {
	createProjectWindow(path);
};

/**
 * @returns {Project}
 */
const getActiveProject = () => {
	return activeProject;
};

/**
 * @void
 */
const refreshProjectList = () => {
	try {
		projectList.refreshList();
	} catch (e) {
		// This has issues when first run, or JSON missing.
	}
};

/**
 * @returns {ProjectList}
 */
const getProjectList = () => {
	return projectList;
};

/**
 * @returns {Package}
 */
const getViewingPackage = () => {
	return viewingPackage;
};

module.exports = {
	openDirectory,
	openProject,
	getActiveProject,
	refreshProjectList,
	getProjectList,
	getViewingPackage,
	fromNewProject
}
