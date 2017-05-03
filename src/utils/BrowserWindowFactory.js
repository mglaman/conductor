'use strict';

let BrowserWindow = require('electron').BrowserWindow;
function getDefaultWindowHeight(w) {
	return Math.round((w / 4) * 3);
}

module.exports = {
	createWindow: (url, width, icon) => {
		let browserWindow = new BrowserWindow({
			width: width,
			height: getDefaultWindowHeight(width),
			icon: icon,
			show: false,
		});
		browserWindow.loadURL(url);
		browserWindow.on('ready-to-show', function() {
			browserWindow.show();
			browserWindow.focus();
		});
		return browserWindow;
	}
}
;
