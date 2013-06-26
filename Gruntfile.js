/*
USAGE
--------------

# run dev version of build
grunt watch:dev

# run production version of build
grunt watch


SETUP
--------------
# install grunt for this project (generates ./node_modules)
npm install

*/
module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        watch: {
            // production
            sass: {
                files: ['css/salogic-flickr-youtube-admin.scss'],
                tasks: ['sass:default']
            },
            js: {
                files: 'js/salogic-flickr-youtube-admin.js',
                tasks: ['uglify:js']
            }
        }, // watch
        uglify: {
            js: {
                src: 'js/salogic-flickr-youtube-admin.js',
                dest: 'js/salogic-flickr-youtube-admin.min.js'
            }
        }, // uglify
        sass: {
            default: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'css/salogic-flickr-youtube-admin.css':'css/salogic-flickr-youtube-admin.scss'
                }
            }
        } // sass
    });

    // load these tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

};

