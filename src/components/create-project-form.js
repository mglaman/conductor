'use strict';

const fs = require('fs');
const remote = require('electron').remote;
const dialog = remote.dialog;
const mainProcess = remote.require('./main');
const thisWindow = remote.getCurrentWindow();
const Composer = require('../utils/Composer');

Vue.component('create-project-form', {
	template: `
		<div>
			<div class="flex flex--row">
				<label for="packageName" class="sr-only"><span>Package name:</span></label>
				<input 
					v-model="packageName"
					type="text"
					name="packageName"
					placeholder="vendor/package"
					style="flex: 1;"/>
			</div>
			<div class="flex flex--row">
				<label for="projectName" class="sr-only"><span>Project name:</span></label>
				<input
					v-model="projectName"
					type="text"
					name="projectName"
					placeholder="some-dir"
					style="flex: 1;"/>
			</div>
			<div class="flex flex--row">
				<label for="destinationFolder" class="sr-only"><span>Destination Folder:</span></label>
				<div class="flex flex--row" style="flex: 1;">
					<input
						v-model="destinationFolder"
						type="text"
						name="destinationFolder" 
						placeholder="/path/to/create/new/project/in" 
						style="flex: 1;" disabled/>
					<button 
						class="button"
						@click="projectDestinationBrowse">Browse <i class="fa fa-search"></i></button>
				</div>
			</div>
			<div class="flex flex--row button__actions">
				<button 
					class="flex"
					@click="composerExecute('create')">
					Create project! <i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'create'"></i></button>
			</div>
			<pre>Destination: {{ destination }}</pre>
			<div class="project__output" id="composer-output">
				<p v-for="line in composerOutLines" :class="line.className">
					{{ line.text }}
				</p>
			</div>
		</div>
	`,
	data: function(){
		return {
			packageName: '',
			projectName: '',
			description: '',
			destinationFolder: '',
			doing: '',
			composerOutLines: []
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
		composerExecute(command) {
			this.doing = command;
			let composer = new Composer(electron.remote.app.getAppPath());
			let process = null;

			switch( command ){
				case 'create':
					process = composer.createProject(this.packageName, this.destination);
					break;
			}

			if (process){
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
					this.doing = '';
					if (code === 0 && fs.existsSync(this.destination + '/composer.json')) {
						mainProcess.fromNewProject(this.destination);
						thisWindow.close();
					}
				});
			}
		}
	}
});
