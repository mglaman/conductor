'use strict';

const Vuex = require('vuex');
const projectList = require('electron').remote.require('./main').getProjectList();

let list = projectList.getList();
let projects = [];
Object.keys(list).map((path) => {
	projects.push({
		path,
		name: list[path]
	});
});

const store = new Vuex.Store({
	state: {
		pageTitle: '',
		projects: projects,
		activeProject: {},
	},
	getters: {
		/**
		 * Get the current page title
		 */
		pageTitle(state) {
			return state.pageTitle;
		},

		/**
		 * Get the formatted projects array
		 */
		projectsList(state) {
			return state.projects;
		},

		/**
		 * Get the active project being viewed
		 */
		activeProject(state) {
			return state.activeProject;
		},
	},
	// no async
	mutations: {
		setPageTitle(state, title) {
			state.pageTitle = title;
		},
		setActiveProject(state, project) {
			state.activeProject = project;
		},
		removeProject(state, path) {
			// remove project from the stored data file
			projectList.removeProject(path);
			// remove project from the global state
			let index = state.projects.findIndex((project) => project.path === path );
			state.projects.splice(index, 1);
		}
	},
	// handles asynchronous
	actions: {
		removeProjectAction(context, path) {
			context.commit('removeProject', path);
		}
	}
});

module.exports = {
	store
}
