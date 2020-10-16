const compile = require('nexe').compile;
const path = require('path');

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

    // default task
    grunt.registerTask('default', ['jshint', 'package']);

    // build platform package task
    grunt.registerTask('buildPlatformPackage', function(platform) {
        if (!platform) {
            throw new Error('No platform provided');
        }

        const outputFolder = path.join(__dirname, `/bin/format-impex-${platform}`);
        const done = this.async();
        compile({
            input: './format-cli.js',
            output: outputFolder,
            target: platform,
        }).then(() => {
            console.log(`successfully created ${platform} build`);
            done();
        });
    });

    // package task -> windows + linux
    grunt.registerTask('package', function() {
        grunt.task.run('buildPlatformPackage:linux-x64-12.0.0', 'buildPlatformPackage:windows');
    });
};