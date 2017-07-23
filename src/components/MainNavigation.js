'use strict';

const fs = require('fs');
const remote = require('electron').remote;
const mainProcess = remote.require('./main');

module.exports = {
	template: `
		<v-list dense class="pt-0">
			<v-list-tile to="recent-projects" :router="true">
				<v-list-tile-action>
					<v-icon>list</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title id="recent-projects">Recent projects</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
			<v-list-tile @click="existingProject">
				<v-list-tile-action>
					<v-icon>folder_open</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title id="open-project">Add existing project</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
			<v-list-tile to="create-project" :router="true">
				<v-list-tile-action>
					<v-icon>create_new_folder</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title id="create-project">Create new project</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
			<v-list-tile @click="globalProject" v-if="globalComposerFileExists">
				<v-list-tile-action>
					<v-icon>public</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title id="global-composer">Global composer</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
			<v-list-tile to="settings" :router="true">
				<v-list-tile-action>
					<v-icon>settings</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title id="open-settings">Settings</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
		</v-list>
	`,
	computed: {
		globalComposerFileExists() {
			return fs.existsSync(remote.app.getPath('home') + '/.composer');
		}
	},
	methods: {
		existingProject: () => {
			mainProcess.openDirectory();
		},
		globalProject: () => {
			mainProcess.openProject(remote.app.getPath('home') + '/.composer');
		},
	}
}
