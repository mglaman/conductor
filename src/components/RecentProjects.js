'use strict';

const mainProcess = require('electron').remote.require('./main');

module.exports = {
	template: `
    <v-list two-line subheader>
      <v-list-tile avatar v-for="project in projects">
        <v-list-tile-avatar>
          <v-icon class="grey lighten-1 white--text">folder</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content @click="openProject(project.path)">
          <v-list-tile-title>{{ project.name }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ project.path }}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple @click="removeProject(project.path)">
            <v-icon class="grey--text text--lighten-1">delete_forever</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
	`,
	computed: {
		projects() {
			return this.$store.getters.projectsList;
		}
	},
	mounted() {
		this.$store.commit('setPageTitle', 'Recent Projects');
	},
	methods: {
		removeProject(path) {
			this.$store.dispatch('removeProjectAction', path);
		},
		openProject: (path) => {
			mainProcess.openProject(path);
		},
	}
}
