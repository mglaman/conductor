'use strict';

const ProjectNavigation = require('../components/ProjectNavigation');
const mainProcess = require('electron').remote.require('./main');

module.exports = {
	template: `
		<v-app id="app" standalone>
			<v-navigation-drawer permanent light>
				<v-toolbar flat class="transparent">
					<v-list class="pa-0">
						<v-list-tile avatar tag="ul" :to="project" :router="true">{{ project.json.name }}</v-list-tile>
					</v-list>
				</v-toolbar>
				<v-divider></v-divider>
				<project-navigation></project-navigation>
			</v-navigation-drawer>
			<v-toolbar class="cyan" dark>
				<v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
			</v-toolbar>
			<main>
				<v-container fluid>
					<router-view></router-view>
					</v-card>
				</v-container>
			</main>
		</v-app>
	`,
	created() {
		this.$store.commit('setActiveProject', mainProcess.getActiveProject());
	},
	mounted() {
		this.$store.commit('setPageTitle', this.project.json.name);
	},
	data() {
		return {
			// settings for the vuetify layout
			drawer: null,
			right: null,
		}
	},
	computed: {
		pageTitle() {
			return this.$store.getters.pageTitle;
		},
		project() {
			return this.$store.getters.activeProject;
		}
	},
	components: {
		'project-navigation': ProjectNavigation
	}
}
