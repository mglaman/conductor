'use strict';

const ComposerFrame = require('./ComposerFrame');

module.exports = {
	template: `
		<v-card>
			<v-card-text>
				<ul class="package__details flex flex--column">
					<li class="package__details--item">
						<span class="package__details--label">Version</span>
						<span class="package__details--value">{{ package.json.version }}</span>
					</li>
					<li class="package__details--item" v-if="package.json.homepage">
						<span class="package__details--label">Homepage</span>
						<span class="package__details--value">{{ package.json.homepage }}</span>
					</li>
					<li class="package__details--item">
						<span class="package__details--value">{{ package.json.description }}</span>
					</li>
					<li v-if="package.packages">
						<span>Requirements</span>
						<ul>
							<li v-for="(version, dependency) in package.packages">
								{{ dependency }}
							</li>
						</ul>
					</li>
					<li v-if="package.packagesDev">
						<span>Dev Requirements</span>
						<ul id="package-dev-dependencies">
							<li v-for="(version, dependency) in package.packagesDev">
								{{ dependency }}
							</li>
						</ul>
					</li>
				</ul>
			</v-card-text>
			<composer-frame :type="'package'" :package="package"></composer-frame>
		</v-card>
	`,
	components: {
		'composer-frame': ComposerFrame
	},
	computed: {
		package() {
			return this.$store.getters.activeProject.getLock().getPackage(this.$route.params.packagePath);
		}
	},
	created() {
		this.$store.commit('setPageTitle', this.package.json.name);
	},
	watch: {
		'$route' () {
			this.$store.commit('setPageTitle', this.package.json.name);
		}
	}
}
