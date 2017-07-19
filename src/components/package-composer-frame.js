'use strict';

const mainProcess = require('electron').remote.require('./main');
const Composer = require('../utils/Composer');

Vue.component('package-composer-frame', {
	template: `
		<div>
			<div class="flex flex--row button__actions">
				<button class="flex"
					@click="composerExecute('update')">
					Update <i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'update'"></i></button>
				<button class="flex"
					@click="composerExecute('remove')">
					Remove <i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'remove'"></i></button>
				<button class="flex"
					@click="composerExecute('show')">
					Show <i class="fa fa-spin fa-circle-o-notch" v-if="doing == 'show'"></i></button>
			</div>
			<div class="project__output" id="composer-output">
				<p v-for="line in composerOutLines" :class="line.className">
					{{ line.text }}
				</p>
			</div>
		</div>
	`,
	props: ['package'],
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
			let composer = new Composer(mainProcess.getActiveProject().getPath());

			switch( command ){
				case 'update':
					process = composer.update(this.package.__get('name'));
					break;
				case 'remove':
					process = composer.remove(this.package.getName());
					break;
				case 'show':
					process = composer.show(this.package.getName());
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
				});
			}
		}
	}
});
