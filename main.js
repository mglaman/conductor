const fs = require('fs');
const electron = require('electron');

const app = electron.app;
const dialog = electron.dialog;
const menu = electron.Menu;
const shell = electron.shell;
const userData = app.getPath('userData');
const Project = require('./models/Project');
const ProjectList = require('./utils/ProjectList');
const BrowserWindowFactory = require('./utils/BrowserWindowFactory');

let windowIcon = __dirname + '/build/icons/icon.svg';
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
	mainWindow = BrowserWindowFactory.createWindow(`file://${__dirname}/windows/index.html`, 600, windowIcon);
	// mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => {
		mainWindow = null
	})
}
function createProjectWindow(folder) {
	try {
		activeProject = new Project(folder);
		projectWindow = BrowserWindowFactory.createWindow(`file://${__dirname}/windows/project/project.html`, 800, windowIcon);
		// projectWindow.webContents.openDevTools();

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

function createPackageWindow(packageName) {
	if (packageWindow !== null) {
		packageWindow.close();
		packageWindow = null;
	}
	viewingPackage = activeProject.getLock().getPackage(packageName);
	packageWindow = BrowserWindowFactory.createWindow(`file://${__dirname}/windows/package/package.html`, 800, windowIcon);
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
	createWindow = BrowserWindowFactory.createWindow(`file://${__dirname}/windows/create/create.html`, 600, windowIcon);
	// packageWindow.webContents.openDevTools();
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

	var template = [
		{
			label: 'Projects',
			submenu: [],
		},
		{
			label: 'Help',
			role: 'help',
			submenu: [
				{
					label: 'Documentation',
					click() {
						shell.openExternal('https://github.com/mglaman/conductor/wiki')
					}
				},
				{
					label: 'Report an issue',
					click() {
						shell.openExternal('https://github.com/mglaman/conductor/issues')
					}
				}
			],
		}
	];

	let menuProjectList = projectList.getList();
	for (var path in menuProjectList) {
		if (!menuProjectList.hasOwnProperty(path)) {
			continue;
		}
		let thisPath = path;
		template[0].submenu.push({
			label: menuProjectList[path],
			click() {
				openProject(thisPath)
			}
		});
	}


	if (process.platform == 'darwin') {
		var name = 'Conductor';
		template.unshift({
			label: name.upp,
			submenu: [
				{
					label: 'About ' + name,
					role: 'about'
				},
				{
					type: 'separator'
				},
				{
					label: 'Services',
					role: 'services',
					submenu: []
				},
				{
					type: 'separator'
				},
				{
					label: 'Hide ' + name,
					accelerator: 'Command+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click() {
						app.quit();
					}
				},
			]
		});
	}

	var appMenu = menu.buildFromTemplate(template);
	menu.setApplicationMenu(appMenu);
	createMainWindow();
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
