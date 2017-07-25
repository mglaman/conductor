'use strict';

const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./main');
const thisWindow = remote.getCurrentWindow();
let activeProject = mainProcess.getActiveProject();

thisWindow.setTitle(activeProject.getName());

const VueRouter = require('vue-router');
const Vuetify = require('vuetify');
const {store} = require('../../store');

Vue.use(Vuetify);
Vue.use(VueRouter);

// Vue components
const ProjectLayout = require('../../components/ProjectLayout');
const ProjectDetails = require('../../components/ProjectDetails');
const PackageDetails = require('../../components/PackageDetails');

const routes = [
	{
		path: '/project',
		name: 'project',
		component: ProjectDetails
	},
	{
		path: '/package/:packagePath',
		name: 'package',
		component: PackageDetails
	},
	{
		path: '*',
		redirect: {
			name: 'project',
		},
	},
];

const router = new VueRouter({
	routes: routes,
	root: '/project',
	mode: 'history',
});


new Vue({
	el: '#app',
	router: router,
	store: store,
	render: h => h(ProjectLayout)
})
