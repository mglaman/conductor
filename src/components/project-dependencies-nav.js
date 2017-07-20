'use strict';

const mainProcess = require('electron').remote.require('./main')

/**
 * List of dependencies
 */
Vue.component('project-dependencies-nav', {
	template: `
		<details v-if="dependencies" open>
			<summary>{{ title }}</summary>
			<ul class="project__dependencies-list">
				<li 
				  v-for="(version,package) in dependencies"
				  v-if="package != 'php' || package.indexOf('ext-') > -1"
					@click="openPackage(package)">
					{{ package }}
				</li>
			</ul>
		</details>
	`,
	props: ['title', 'dependencies'],
	methods: {
		openPackage: (packageName) => {
			mainProcess.openPackage(packageName);
		}
	}
});
