module.exports = function (grunt) {
	/** @var {Grunt} grunt */
	'use strict';

	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	RegExp.quote = function (string) {
		return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
	};

	var fs = require('fs');
	var path = require('path');

	// Project configuration.
	grunt.initConfig({

		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
		' * ForkdIn v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
		' */\n',

		// Task configuration.
		clean: {
			dist: 'css'
		},

		sass: {
			options: {
				includePaths: ['scss'],
				precision: 6,
				sourceComments: false,
				sourceMap: true,
				outputStyle: 'expanded'
			},
			core: {
				files: {
					'css/<%= pkg.name %>.css': 'scss/styles.scss'
				}
			}
		},
		watch: {
			sass: {
				files: 'scss/**/*.scss',
				tasks: ['dist-css']
			}
		}

	});


	// These plugins provide necessary tasks.
	require('load-grunt-tasks')(grunt);

	grunt.registerTask('sass-compile', ['sass:core']);
	grunt.registerTask('dist-css', ['sass-compile']);

	// Full distribution task.
	grunt.registerTask('build', ['clean:dist', 'dist-css']);
	grunt.registerTask('default', ['build', 'watch']);
};
