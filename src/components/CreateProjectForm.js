'use strict';

const fs = require('fs');
const remote = require('electron').remote;
const dialog = remote.dialog;
const mainProcess = remote.require('./main');
const thisWindow = remote.getCurrentWindow();
const Composer = require('../utils/Composer');
const ComposerFrame = require('./ComposerFrame');

module.exports = {
	template: `
		<v-card>
			<v-card-text>
				<v-container fluid>
					<v-layout row>
						<v-text-field
							v-model="packageName"
							name="packageName"
							label="Package Name"
							hint="vendor/package"
							persistent-hint
							required
						></v-text-field>
					</v-layout>
					<v-layout row>
						<v-text-field
							v-model="projectName"
							name="projectName"
							label="Project Name"
							hint="some-dir"
							persistent-hint
							required
						></v-text-field>
					</v-layout>
					<v-layout row>
						<v-flex xs8>
							<v-text-field
								v-model="destinationFolder"
								name="destinationFolder"
								label="Destination Folder"
								disabled
							></v-text-field>
						</v-flex>
						<v-flex xs4>
							<v-btn light
								@click="projectDestinationBrowse">Browse <i class="fa fa-search"></i></v-btn>
						</v-flex>
					</v-layout>
					<v-layout row>
						<v-text-field
							v-model="destination"
							label="Destination" 
							disabled
						></v-text-field>
					</v-layout>
				</v-container>
			</v-card-text>
			<composer-frame :type="'create'" :newProjectDetails="{packageName,projectName,description,destinationFolder,destination}"></composer-frame>
		</v-card>
	`,
	components: {
		'composer-frame': ComposerFrame
	},
	data: function(){
		return {
			packageName: '',
			projectName: '',
			description: '',
			destinationFolder: '',
		}
	},
	computed: {
		destination(){
			return this.destinationFolder + '/' + this.projectName;
		}
	},
	methods: {
		projectDestinationBrowse (){
			let folder = dialog.showOpenDialog(thisWindow, {
				properties: ['openDirectory'],
			});
			if (!folder) {
				this.destinationFolder = '';
			}
			this.destinationFolder = folder;
		},
	}
}
