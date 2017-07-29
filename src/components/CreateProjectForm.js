'use strict';

const fs = require('fs');
const os = require('os');
const user = os.userInfo();
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
            <v-select
              :items="availableCreateActions"
              v-model="createAction"
              label="Create Action"
              hint="Choose how to create the new project"
							persistent-hint
							return-object
							required
              bottom
            ></v-select>
					</v-layout>
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
					<v-layout row v-if="createAction.value == 'create-project'">
						<v-text-field
							v-model="projectName"
							name="projectName"
							label="Project Name"
							hint="some-directory"
							persistent-hint
							required
						></v-text-field>
					</v-layout>
					<v-layout row v-if="createAction.value == 'init'">
						<v-text-field
							v-model="description"
							name="description"
							label="Project Description"
							hint="About the new project"
							persistent-hint
							auto-grow
							:required="createAction.value == 'init'"
						></v-text-field>
					</v-layout>
					<v-layout row v-if="createAction.value == 'init'">
						<v-text-field
							v-model="authorName"
							name="authorName"
							label="Project Author Name"
							hint="Your Name"
							persistent-hint
							:required="createAction.value == 'init'"
						></v-text-field>
					</v-layout>
					<v-layout row v-if="createAction.value == 'init'">
						<v-text-field
							v-model="authorEmail"
							name="authorEmail"
							label="Project Author Email"
							hint="your-email@example.org"
							persistent-hint
							:required="createAction.value == 'init'"
						></v-text-field>
					</v-layout>
					<v-layout row v-if="createAction.value == 'init'">
            <v-select
              :items="availableProjectTypes"
              v-model="projectType"
              label="Project Type"
              hint="The type of the package."
							persistent-hint
							return-object
							:required="createAction.value == 'init'"
              bottom
            ></v-select>
					</v-layout>
					<v-layout row v-if="createAction.value == 'init'">
            <v-select
              :items="availableStability"
              v-model="stability"
              label="Minimum Stability"
              hint="This defines the default behavior for filtering packages by stability."
							persistent-hint
							return-object
							:required="createAction.value == 'init'"
              bottom
            ></v-select>
					</v-layout>
					<v-layout row v-if="createAction.value == 'init'">
						<v-text-field
							v-model="license"
							name="license"
							label="License"
							hint="The license of the package."
							persistent-hint
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
					<v-layout row v-if="createAction.value == 'create-project'">
						<v-text-field
							v-model="destination"
							label="Destination" 
							disabled
						></v-text-field>
					</v-layout>
				</v-container>
			</v-card-text>
			<composer-frame 
				:type="'create'" 
				:newProjectDetails="{createAction,packageName,projectName,description,authorName,authorEmail,projectType,stability,license,destinationFolder,destination}"
			></composer-frame>
		</v-card>
	`,
	components: {
		'composer-frame': ComposerFrame
	},
	data: function(){
		return {
			packageName: '',
			projectName: '',
			destinationFolder: user.homedir,
			description: '',
			authorName: user.username,
			authorEmail: '',
			license: '',
			projectType: { value: 'library', text: 'Library' },
			availableProjectTypes: [
				{ value: 'library', text: 'Library' },
				{ value: 'project', text: 'Project' },
				{ value: 'metapackage', text: 'Meta package' },
				{ value: 'composer-plugin', text: 'Composer Plugin' },
			],
			stability: { value: 'stable', text: 'Stable' },
			availableStability: [
				{ value: 'stable', text: 'Stable' },
				{ value: 'dev', text: 'Development branches' },
				{ value: 'RC', text: 'Release candidates' },
				{ value: 'alpha', text: 'Alpha' },
				{ value: 'beta', text: 'Beta' },
			],
			createAction: { value: 'create-project', text: 'From existing project' },
			availableCreateActions: [
				{ value: 'create-project', text: 'From existing project' },
				{ value: 'init', text: 'Initialize new empty project' }
			],
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
				properties: ['openDirectory','createDirectory'],
			});
			if (!folder.length) {
				folder = user.homedir;
			}
			this.destinationFolder = folder[0];
		},
	}
}
