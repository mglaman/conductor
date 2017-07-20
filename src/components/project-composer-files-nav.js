'use strict';


/**
 * List of composer related files
 */
Vue.component('project-composer-files-nav', {
	template: `
		<details open>
			<summary>Composer</summary>
			<ul>
				<li>composer.json</li>
				<li v-if="project.isInstalled">composer.lock</li>
			</ul>
		</details>
	`,
	props: ['project'],
});
