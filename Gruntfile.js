/*
 Copyright 2016

 By NAK Sued Webmasters

 Full source at https://github.com/nak-sued-webmasters/print-cal
 Licensed under the MIT License (MIT) license. Please see LICENSE for more information.

 */
'use strict';
/**
 * Grunt Module
 * @param {type} grunt
 */
/*jshint node:true */
module.exports = function (grunt) {
   /**
    * Configuration
    */
   grunt.initConfig({
      /**
       * Get package meta data
       */
      pkg: grunt.file.readJSON('package.json'),
      /**
       * Project banner
       */
      tag: {
         banner: '/*!\n' +
                 ' * <%= pkg.name %>\n' +
                 ' * <%= pkg.title %>\n' +
                 ' * <%= pkg.url %>\n' +
                 ' * @author <%= pkg.author %>\n' +
                 ' * @version <%= pkg.version %>\n' +
                 ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
                 ' */\n',
         deploy: {
            dest: 'target/files/<%= pkg.name %>/css/'
         },
      },
      cssmin: {
         minify: {
            files: [{
                  expand: true,
                  cwd: 'target/files/<%= pkg.name %>/css/',
                  src: ['**/*.css', '!*.min.css'],
                  dest: 'target/files/<%= pkg.name %>/css/',
                  ext: '.min.css'
               }, /*{
                expand: true,
                cwd: 'src/css/',
                src: ['*.min.css'],
                dest: 'src/css/',
                ext: '.min.css'
                }*/]
         }
      },
      /**
       *
       */
      uglify: {
         options: {
            // the banner is inserted at the top of the output
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            sourceMap: true,
            sourceMapName: function (dest, src) {
               var folder = src.substring(0, src.lastIndexOf('/'));
               var filename = src.substring(src.lastIndexOf('/'), src.length);
               filename = filename.substring(0, filename.lastIndexOf('.'));
               return dest + folder + filename + '.min.map';
            }
         },
         build: {
            src: ['src/**/*.js', '!**/*.min.js'],
            cwd: 'target/files/<%= pkg.name %>/js/',
            dest: 'src/js/',
            expand: true,
            rename: function (dest, src) {
               var folder = src.substring(0, src.lastIndexOf('/'));
               var filename = src.substring(src.lastIndexOf('/'), src.length);
               filename = filename.substring(0, filename.lastIndexOf('.'));
               return dest + folder + filename + '.min.js';
            }
         }
      },
      /**
       *
       */
      jshint: {
         options: {
            jshintrc: '.jshintrc'
         },
         files: [
            'Gruntfile.js',
            'src/js/print-cal.js',
           // 'src/js/ical_parser.js',
         ]
      },
      /**
       *
       */
      copy: {
         build: {
            nonull: true,
            cwd: 'src/',
            src: ['**', '!**/*.scss'],
            expand: true,
            dest: 'target/files/<%= pkg.name %>/'
         }
      },
      /**
       *
       */
      compress: {
         main: {
            options: {
               archive: 'target/<%= pkg.name %>.zip',
               mode: 'zip'
            },
            files: [
               {
                  expand: true,
                  filter: 'isFile',
                  cwd: 'target/files/<%= pkg.name %>/',
                  src: ['**'],
                  dest: '/'
               }
            ]
         }
      },
      /**
       *
       */
      clean: {
         build: {
            src: ['target/files/<%= pkg.name %>/']
         }
      },
      /**
       *
       */
      watch: {
         grunt: {
            files: ['Gruntfile.js']
         },
         livereload: {
            files: [
               'src/*',
               'src/css/**/*.css',
               'src/html/**/*.{html,php}',
               'src/img/**/*.{png,jpg,jpeg,gif}'
            ],
            tasks: ['copy:deploy'],
            options: {
               //interrupt: true,
               livereload: true
            }
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-cssmin');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-compress');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-clean');

   /**
    * Build task
    * Run `grunt build` on the command line
    * This will generate ZIP-Archive with all required artifacts for the Joomla!-Template.
    */
   grunt.registerTask('build',
           'Compiles all of the assets and copies the files to the build directory.',
           [ 'copy:build', 'cssmin', 'uglify', 'compress']
           );
   /**
    * Default task
    * Run `grunt` on the command line
    * This will compile sass-Files on the fly and copy changed files to testing server (deploy).
    */
   grunt.registerTask('default',
           [ 'jshint', 'watch']
           );
};
