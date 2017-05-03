const BrowserWindowElectron = require('electron').BrowserWindow;
const autoUpdater = require('electron-updater').autoUpdater;
const isDev = require('electron-is-dev');
const os = require('os');


class AppUpdater {
	constructor() {

		if (isDev === true) {
			return;
		}

		const platform = os.platform();
		if (platform === "linux") {
			return
		}

		autoUpdater.signals.updateDownloaded(it => {
			notify("A new update is ready to install", `Version ${it.version} is downloaded and will be automatically installed on Quit`)
		});
		autoUpdater.checkForUpdates()
	}
}

function notify(title, message) {
	let windows = BrowserWindowElectron.getAllWindows();
	if (windows.length === 0) {
		return
	}

	windows[0].webContents.send("notify", title, message)
}

module.exports = AppUpdater;
