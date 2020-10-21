const compile = require('nexe').compile;
const path = require('path');

module.exports = function (grunt) {

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    // initialize configuration
    grunt.initConfig({
        clean: [
            'bin',
        ],
        jshint: {
            all: ['*.js'],
            options: {
                esversion: 6,
                force: true
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/**/*.js']
            }
        }
    });

    // default task
    grunt.registerTask('default', ['clean', 'jshint', 'mochaTest', 'package']);

    // build platform package task
    grunt.registerTask('buildPlatformPackage', function (platform) {
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
    grunt.registerTask('package', function () {
        grunt.task.run('buildPlatformPackage:linux-x64-12.0.0', 'buildPlatformPackage:windows-x64-12.16.3');
    });
};