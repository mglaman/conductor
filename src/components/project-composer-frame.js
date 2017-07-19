'use strict';

const mainProcess = require('electron').remote.require('./main');
const Composer = require('../utils/Composer');
let activeProject = mainProcess.getActiveProject();
let projectInstalled = activeProject.isInstalled();

/**
 * Composer output frame
 */
Vue.component('project-composer-frame', {
	template: `
		<div>
			<div class="flex flex--row button__actions">
				<button class="flex"
				  @click="composerExecute('install')">
					Install <i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'install'"></i>
				</button>
				<button class="flex"
				 	@click="composerExecute('update')"
					v-if="project.lock">
					Update <i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'update'"></i>
				</button>
				<button class="flex"
					@click="composerExecute('validate')">
					Validate <i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'validate'"></i>
				</button>
				<!--<button class="flex" id="action-composer-add">Add <i class="fa fa-spin fa-circle-o-notch hidden"></i></button>-->
				<!--<button class="flex" id="action-composer-remove">Remove <i class="fa fa-spin fa-circle-o-notch hidden"></i></button>-->
			</div>
			<div class="project__output" id="composer-output">
				<p v-for="line in composerOutLines" :class="line.className">
					{{ line.text }}
				</p>
			</div>
	</div>
	`,
	props: ['project'],
	data: function() {
		return {
			doing: '',
			composerOutLines: [],
		}
	},
	methods: {
		composerExecute(command) {
			this.doing = command;
			let process = null;
			let composer = new Composer(activeProject.getPath());

			switch( command ){
				case 'install':
					process = composer.install();
					break;
				case 'update':
					process = composer.update(null);
					break;
				case 'validate':
					process = composer.validate();
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

					if (code === 0) {
						activeProject.refreshData();
						projectInstalled = activeProject.isInstalled();
						// @todo get some kind of binding to not need to do this.
						// thisWindow.reload();
					}
				});
			}
		}
	}
});
