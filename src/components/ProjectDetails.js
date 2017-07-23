'use strict';

const ComposerFrame = require('./ComposerFrame');

module.exports = {
	template: `
		<v-card>
			<v-card-text>
				<div>
					<p v-if="project.json.homepage">{{ project.json.homepage }}</p>
					<p>{{ project.json.description }}</p>
				</div>
			</v-card-text>
			<composer-frame :type="'project'" :project="project"></composer-frame>
		</v-card>
	`,
	components: {
		'composer-frame': ComposerFrame
	},
	computed: {
		project() {
			return this.$store.getters.activeProject;
		},
	},
}
