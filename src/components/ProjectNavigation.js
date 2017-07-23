'use strict';

const mainProcess = require('electron').remote.require('./main')

module.exports = {
	template: `
		<v-list dense>
			<v-list-group>
				<v-list-tile slot="item">
					<v-list-tile-action>
						<v-icon>queue_music</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Composer</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-icon>keyboard_arrow_down</v-icon>
					</v-list-tile-action>
				</v-list-tile>
				<v-list-tile>
					<v-list-tile-content>
						<v-list-tile-title>composer.json</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile>
					<v-list-tile-content>
						<v-list-tile-title>composer.lock</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list-group>
			<template v-if="list.items" v-for="list in dependencies" >
				<v-list-group :value="list.active" :key="list.type">
					<v-list-tile slot="item">
						<v-list-tile-action>
							<v-icon>{{ list.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>{{ list.title }}</v-list-tile-title>
						</v-list-tile-content>
						<v-list-tile-action>
							<v-icon>keyboard_arrow_down</v-icon>
						</v-list-tile-action>
					</v-list-tile>
					<template v-for="(version,package) in list.items">
						<v-list-tile 
							:to="{name: 'package', params: { packagePath: package } }" 
							:router="true"
							v-if="package != 'php' || package.indexOf('ext-') > -1">
							<v-list-tile-content>
								<v-list-tile-title>{{ package }}</v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
					</template>
				</v-list-group>
			</template>
		</v-list>
	`,
	computed: {
		project() {
			return this.$store.getters.activeProject;
		},
		dependencies() {
			return {
				required: {
					title: 'Requirements',
					icon: 'beenhere',
					items: this.project.getRequire(),
					active: true,
				},
				dev: {
					title: 'Development Requirements',
					icon: 'build',
					items: this.project.getRequireDev(),
					active: false,
				}
			};
		}
	},
	methods: {
		openPackage: (packageName) => {
			mainProcess.openPackage(packageName);
		}
	}
}
