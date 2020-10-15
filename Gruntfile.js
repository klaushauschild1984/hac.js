module.exports = function (grunt) {

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // initialize configuration
    grunt.initConfig({
        jshint: {
            all: ['*.js'],
            options: {
                esversion: 6,
                force: true
            }
        },
    });

    // register tasks
    grunt.registerTask('default', ['jshint']);

};