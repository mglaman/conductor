'use strict';


module.exports = {
	template: `
    <v-card>TODO</v-card>
	`,
	mounted() {
		this.$store.commit('setPageTitle', 'Settings');
	},
	methods: {
	}
}
