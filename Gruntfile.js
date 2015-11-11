"use strict";

module.exports = function ( grunt )
{
    grunt.initConfig( {
        clean: {
            coverage: [ "coverage/**" ]
        },
        less: {
            "build/dist.css": [ "source/styles/main.less" ]
        },
        browserify:
        {
            test:
            {
                options: {
                    transform: [
                        [ "browserify-istanbul", {
                            ignore: [ "**/node_modules/**", "**/tests/**" ]
                        } ],
                        [ "babelify", { presets: [ "es2015" ] } ]
                    ],
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    "build/test.js": [ "tests/harness.js" ]
                }
            }
        },
        protractor_coverage: {
            options: {
                keepAlive: false,
                noColor: false,
                coverageDir: "coverage/protractor",
                args: {
                    baseUrl: "http://localhost:3000"
                }
            },
            test: {
                options: {
                    configFile: "tests/config/protractor-config.js"
                }
            }
        },
        makeReport: {
            src: "coverage/**/*.json",
            options: {
                type: [ "lcov", "html" ],
                dir: "coverage/net",
                print: "detail"
            }
        }
    } );

    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-browserify" );
    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadNpmTasks( "grunt-protractor-coverage" );
    grunt.loadNpmTasks( "grunt-istanbul" );

    grunt.registerTask( "default", [ "clean", "less", "browserify", "protractor_coverage", "makeReport" ] );
};
