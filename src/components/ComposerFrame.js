'use strict';

const fs = require('fs');
const remote = require('electron').remote;
const dialog = remote.dialog;
const mainProcess = remote.require('./main');
const thisWindow = remote.getCurrentWindow();
const Composer = require('../utils/Composer');

module.exports = {
	template: `
		<v-card>
			<v-card-text>
				<v-btn light 
					v-if="type == 'create'"
					@click="composerExecute('create')">
					Create project!
					<i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'create'"></i>
				</v-btn>
				<v-btn light
					v-if="type == 'project'"
				  @click="composerExecute('install')">
					Install
					<i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'install'"></i>
				</v-btn>
				<v-btn light 
					v-if="type == 'project'"
					@click="composerExecute('validate')">
					Validate
					<i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'validate'"></i>
				</v-btn>
				<v-btn light
					v-if="type == 'project'"
				 	@click="composerExecute('updateProject')">
					Update
					<i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'updateProject'"></i>
				</v-btn>
				<v-btn light
					v-if="type == 'package'"
					@click="composerExecute('show')">
					Show
					<i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'show'"></i>
				</v-btn>
				<v-btn light 
					v-if="type == 'package'"
					@click="composerExecute('updatePackage')">
					Update
					<i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'updatePackage'"></i>
				</v-btn>
				<v-btn light 
					v-if="type == 'package'"
					@click="composerExecute('remove')">
					Remove
					<i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'remove'"></i>
				</v-btn>
			</v-card-text>
			
			<v-expansion-panel expand tile flat height="0">
				<v-expansion-panel-content>
					<div slot="header">Add Package</div>
					<v-container fluid v-if="type == 'project'">
						<v-layout row>
							<v-flex xs4>
								<v-text-field
									v-model="addRequirement.name"
									label="Package Name"
									hint="vendor/package:version"
									persistent-hint
									required
								></v-text-field>
							</v-flex>
							<v-flex xs4>
								<v-select
									:items="addRequirement.requirementTypes"
									v-model="addRequirement.type"
									label="Requirement Type"
									required
									bottom
								></v-select>
							</v-flex>
							<v-flex xs4>
								<v-btn light
									@click="composerExecute('add-requirement')">
									Add Package
									<i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'add-requirement'"></i>
								</v-btn>
							</v-flex>
						</v-layout>
					</v-container>
				</v-expansion-panel-content>
			</v-expansion-panel>
			<v-card-title v-if="composerOutLines.length">Console Output</v-card-title>
			<div class="project__output" id="composer-output">
				<p v-for="line in composerOutLines" :class="line.className">
					{{ line.text }}
				</p>
			</div>
		</v-card>
	`,

	data: function() {
		return {
			addRequirement: {
				name: '',
				type: 'require',
				requirementTypes: [
					{ value: 'require', text: 'Requirement' },
					{ value: 'dev', text: 'Dev Requirement' },
				]
			},
			doing: '',
			composerOutLines: [],
		}
	},
	props: {
		type: {
			default: '', // project | package | create
			type: String
		},
		project: {
			default: null,
			type: Object,
		},
		package: {
			default: null,
			type: Object,
		},
		newProjectDetails: {
			default: null,
		}
	},
	methods: {
		composerExecute(command) {
			this.doing = command;
			let process = null;
			let composer = null;
			let activeProject = null;
			let projectInstalled = null;

			switch( this.type )
			{
				/*
				 * Project actions
				 */
				case 'project':
					activeProject = mainProcess.getActiveProject();
					projectInstalled = activeProject.isInstalled();
					composer =  new Composer(activeProject.getPath());

					switch( command ) {
						case 'install':
							process = composer.install();
							break;
						case 'updateProject':
							process = composer.update(null);
							break;
						case 'validate':
							process = composer.validate();
							break;
						case 'add-requirement':
							process = composer.require(this.addRequirement.name, (this.addRequirement.type === 'dev'));
							break;
					}
					break;

				/*
				 * Package actions
				 */
				case 'package':
					activeProject = mainProcess.getActiveProject();
					composer = new Composer(activeProject.getPath());

					switch( command ){
						// package
						case 'updatePackage':
							process = composer.update(this.package.__get('name'));
							break;
						case 'remove':
							process = composer.remove(this.package.getName(), activeProject.packageIsDev(this.package.getName()));
							break;
						case 'show':
							process = composer.show(this.package.getName());
							break;
					}
					break;

				/*
				 * Create project actions
				 */
				case 'create':
					composer = new Composer(remote.app.getAppPath());

					switch( command ){
						// create project
						case 'create':
							let action = this.newProjectDetails.createAction.value;

							if (action === 'create-project'){
								process = composer.createProject(this.newProjectDetails.packageName, this.newProjectDetails.destination);
							}
							else if (action === 'init'){
								// init requires that the folder already exists
								process = composer.initProject(this.newProjectDetails.destinationFolder, {
									name: this.newProjectDetails.packageName,
									description: this.newProjectDetails.description,
									author: `${this.newProjectDetails.authorName} <${this.newProjectDetails.authorEmail}>`,
									type: this.newProjectDetails.projectType.value,
									stability: this.newProjectDetails.stability.value,
									license: this.newProjectDetails.license,
								})
							}
							break;
					}
					break;
			}

			if (composer && process){
				process.stdout.on('data', (data) => {
					this.composerOutLines.push({
						text: String(data),
						className: 'log--output'
					});
				});
				process.stderr.on('data', (data) => {
					this.composerOutLines.push({
						text: String(data),
						className: 'log--output'
					});
				});
				process.on('error', (data) => {
					this.doing = '';
					this.composerOutLines.push({
						text: String(data),
						className: 'log--error'
					});
				});
				process.on('close', (code) => {
					let goToProject = this.doing === 'remove';

					this.doing = '';

					if (goToProject) {
						this.$router.push({ name: 'project'});
						this.$store.commit('setPageTitle', activeProject.getName());
					}

					// From project
					if ( this.project && this.type === 'project' ){
						if (code === 0) {
							activeProject.refreshData();
							projectInstalled = activeProject.isInstalled();
							// @todo get some kind of binding to not need to do this.
							// thisWindow.reload();
						}
					}

					// from Create project
					if ( this.type === 'create' ){
						if (code === 0 && fs.existsSync(this.newProjectDetails.destination + '/composer.json')) {
							mainProcess.fromNewProject(this.newProjectDetails.destination);
						}
					}
				});
			}
		}
	}
}
