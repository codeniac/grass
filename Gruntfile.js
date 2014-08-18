var __ = require('underscore');

module.exports = function(grunt) {

	/**
	 * Load the plugins that provides the tasks.
	 */
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	/**
	 * Configuration
	 */
	var grunt_config = require( './grunt.config.js' );

	//####################################################################################################
	//										Tasks Configuration
	//####################################################################################################
	var tasks_config = {
		pkg: grunt.file.readJSON('package.json'),

		meta: {
			banner: 
				'/**\n' +
				' * <%= pkg.name %> - v<%= pkg.version %>\n' +
				' * <%= pkg.homepage %>\n' +
				' *\n' +
				' * Created by <%= pkg.author %> on <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.company %>. All rights reserved.\n' +
				' */\n'
		},

		/**
		 * Clean task configuration.
		 */
		clean: {
			prod: [ '<%= production_dir %>' ],
			options: {
				force: true
			}
		},

		/**
		 * Copy task configuration.
		 */
		copy: {
			assets: {
				files: [
					{
						cwd: '.',
						src: [ 'assets/**/*' ],
						dest: '<%= production_dir %>',
						expand: true
					}
				]
			}
		},

		/**
		 * Sass task configuration : compile/minify sass files.
		 */
		sass: {
			dev: {
				files: {
					'<%= production_dir %>/css/<%=pkg.name %>.css': '<%= app_files.sass %>'
				}
			},

			prod: {
				files: {
					'<%= production_dir %>/css/<%=pkg.name %>.min.css': '<%= app_files.sass %>'
				},

				options: {
					style: 'compressed'
				}
			}
		},

		/**
		 * Watch task configuration.
		 */
		delta: {
			options: {
				livereload: 35730
			},

			sass: {
				files: ['sass/**/*.scss'],
				tasks: [ 'sass:dev', 'sass:prod' ]
			},
		}
	};


	//####################################################################################################
	//										Grunt Configuration
	//####################################################################################################
	grunt.initConfig( __.extend( tasks_config, grunt_config ) );


	//####################################################################################################
	//										Tasks Registration
	//####################################################################################################
	/**
	 * Watch Task
	 */
	grunt.renameTask( 'watch', 'delta' );
	grunt.registerTask( 'watch', [ 'default', 'delta' ] );

	/**
	 * Default Task
	 */
	grunt.registerTask( 'default', [
		'clean:prod',
		'sass:dev',
		'sass:prod',
		'copy:assets'
	]);
};