'use strict';

const electron = require('electron');
const app = electron.app;
const menu = electron.Menu;
const shell = electron.shell;
const main = require('../../main');

let template = [
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

if (process.platform === 'darwin') {
	const name = 'Conductor';
	template.unshift({
		label: name,
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


module.exports = {
	setProjects: (projects) => {
		let key = (process.platform === 'darwin') ? 1 : 0;
		for (let path in projects) {
			if (!projects.hasOwnProperty(path)) {
				continue;
			}
			template[key].submenu.push({
				label: projects[path],
				click() {
					main.openProject(path)
				}
			});
		}
	},
	setMenu: () => {
		let appMenu = menu.buildFromTemplate(template);
		menu.setApplicationMenu(appMenu);
	}
};
