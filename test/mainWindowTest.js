const Application = require("spectron").Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = require('assert');

let electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

if (process.platform === 'win32') {
	electronPath += '.cmd';
}
// Path to your application
const appPath = path.join(__dirname, '..');

global.before(function () {
	chai.should();
	chai.use(chaiAsPromised)
});

const app = new Application({
	path: electronPath,
	args: [appPath]
});

describe('application launch', function () {
	this.timeout(10000);

	beforeEach(function () {
		return app.start().then(function () {
			assert.equal(app.isRunning(), true);
			chaiAsPromised.transferPromiseness = app.transferPromiseness;
			return app;
		})
	});

	afterEach(function () {
		if (app && app.isRunning()) {
			return app.stop()
		}
	});

	it('load Conductor project listing window', function () {
		/** @type WebdriverIO.Client**/
		const client = app.client;

		return client.waitUntilWindowLoaded()
			.browserWindow.focus()
			.getWindowCount().should.eventually.equal(1)
			.browserWindow.isMinimized().should.eventually.be.false
			.browserWindow.isDevToolsOpened().should.eventually.be.false
			.browserWindow.isVisible().should.eventually.be.true
			.browserWindow.isFocused().should.eventually.be.true
			.getText('#open-project').should.eventually.equal('Existing project')
			.getText('#new-project').should.eventually.equal('New project')
			.getText('#open-settings').should.eventually.equal('Settings')
	})
});
