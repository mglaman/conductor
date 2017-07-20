'use strict';

/**
 * General project details
 */
Vue.component('project-details', {
	template: `
		<div class="project-details">
			<div class="flex flex--row project__title">
				<h1>{{ project.json.name }}</h1>
			</div>
			<p>{{ project.json.description }}</p>
			<p v-if="project.json.homepage">{{ project.json.homepage }}</p>
		</div>
	`,
	props: ['project'],
});
