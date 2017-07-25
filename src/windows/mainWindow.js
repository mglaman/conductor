'use strict';

const VueRouter = require('vue-router');
const Vuetify = require('vuetify');

Vue.use(Vuetify);
Vue.use(VueRouter);

// components
const MainLayout = require('../components/MainLayout');
const RecentProjects = require('../components/RecentProjects');
const CreateProjectForm = require('../components/CreateProjectForm');
const SettingsForm = require('../components/SettingsForm');

const {store} = require('../store');

const routes = [
	{
		path: '/recent-projects',
		name: 'recent-projects',
		component: RecentProjects
	},
	{
		path: '/create-project',
		name: 'create-project',
		component: CreateProjectForm
	},
	{
		path: '/settings',
		name: 'settings',
		component: SettingsForm
	},
	{
		path: '*',
		redirect: {
			name: 'recent-projects',
		},
	},
];

const router = new VueRouter({
	routes: routes,
	root: '/recent-projects',
	mode: 'history',
});

new Vue({
	el: '#app',
	router: router,
	store: store,
	render: h => h(MainLayout)
})

