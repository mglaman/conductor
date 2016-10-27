const fs = require('fs');
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const userData = app.getPath('userData');
const Project = require('./models/Project');
const ProjectList = require('./utils/ProjectList');

let projectList = new ProjectList(userData);
let mainWindow = null;
let projectWindow = null;
let packageWindow = null;
let createWindow = null;

/**
 * @type {Project}
 */
let activeProject = null;
let viewingPackage = null;



function createMainWindow() {
	refreshProjectList();
	mainWindow = new BrowserWindow({width: 600, height: 450});
	mainWindow.loadURL(`file://${__dirname}/windows/index.html`);
	// mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => {
		mainWindow = null
	})
}
function createProjectWindow(folder) {
	try {
		activeProject = new Project(folder);
		projectWindow = new BrowserWindow({width: 800, height: 600});
		projectWindow.loadURL(`file://${__dirname}/windows/project/project.html`);
		// projectWindow.webContents.openDevTools();

		projectWindow.on('show', () => {
			if (mainWindow !== null) {
				mainWindow.close();
			}
		});
		projectWindow.on('closed', () => {
			activeProject = null;
			projectWindow = null;
			createMainWindow();
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

function createPackageWindow(packageName) {
	if (packageWindow !== null) {
		packageWindow.close();
		packageWindow = null;
	}
	viewingPackage = activeProject.getLock().getPackage(packageName);
	packageWindow = new BrowserWindow();
	packageWindow.loadURL(`file://${__dirname}/windows/package/package.html`);
	// packageWindow.webContents.openDevTools();
	packageWindow.on('closed', () => {
		if (activeProject !== null) {
			activeProject.refreshData();
		}
		viewingPackage = null;
		packageWindow = null;
	});
}

function createCreateWindow() {
	mainWindow.close();
	createWindow = new BrowserWindow({width: 600, height: 450});
	createWindow.loadURL(`file://${__dirname}/windows/create/create.html`);
	// packageWindow.webContents.openDevTools();
	createWindow.on('closed', () => {
		activeProject = null;
		projectWindow = null;
		createWindow = null;
		createMainWindow();
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

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
	var composerJson = require(folder + '/composer.json');
	var projectsJson = require(userData + '/projects.json');
	projectsJson[folder] = composerJson.name;
	fs.writeFile(userData + '/projects.json', JSON.stringify(projectsJson));
	// createProjectWindow(folder);
};

const openDirectory = function () {
	var folder = dialog.showOpenDialog(mainWindow, {
		properties: ['openDirectory'],
	});
	if (!folder) {
		return;
	}
	fs.exists(folder + '/composer.json', function (exists) {
		if (exists) {
			var composerJson = require(folder + '/composer.json');
			var projectsJson = require(userData + '/projects.json');
			projectsJson[folder] = composerJson.name;
			fs.writeFile(userData + '/projects.json', JSON.stringify(projectsJson));

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
exports.openDirectory = openDirectory;

const openProject = function (path) {
	createProjectWindow(path);
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

const openPackage = function (packageName) {
	createPackageWindow(packageName);
};
exports.openPackage = openPackage;

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
