'use strict';

const MainNavigation = require('./MainNavigation');

module.exports = {
	template: `
		<v-app standalone>
			<v-navigation-drawer permanent light>
				<v-toolbar flat class="transparent">
					<v-list class="pa-0">
						<v-list-tile avatar tag="ul">Conductor</v-list-tile>
					</v-list>
				</v-toolbar>
				<v-divider></v-divider>
				<main-navigation></main-navigation>
			</v-navigation-drawer>
			<v-toolbar class="cyan" dark>
				<v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
			</v-toolbar>
			<main>
				<v-container fluid>
					<router-view></router-view>
				</v-container>
			</main>
		</v-app>
	`,

	components: {
		'main-navigation': MainNavigation
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
		}
	}
}
