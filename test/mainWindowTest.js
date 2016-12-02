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

const app = new Application({
	path: electronPath,
	args: [appPath]
});

describe('application launch', function () {
	this.timeout(10000)

	beforeEach(function () {
		this.app = new Application({
			path: electronPath,
			args: [appPath]
		});
		return this.app.start()
	});

	afterEach(function () {
		if (this.app && this.app.isRunning()) {
			return this.app.stop()
		}
	});

	it('shows an initial window', function () {
		return this.app.client.getWindowCount().then(function (count) {
			assert.equal(count, 1)
		})
	})
});
