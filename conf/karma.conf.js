module.exports = function(config) {
    "use strict";

    config.set({
        basePath: "..",
        singleRun: true,
        frameworks: ["jasmine"],
        browsers: ["PhantomJS"],
        preprocessors: {
            "build/ugma.js": "coverage"
        }, // coverage not set up. Need a account!!
        coverageReporter: {
            type: "html",
            dir: "coverage/"
        },
        files: [
            "./test/lib/jasmine-tools.js",
            "./build/ugma.js",
            "./test/modules/**/*.js"
        ],
        // default configuration, not required 
        traceurPreprocessor: {
            // options passed to the traceur-compiler 
            // see traceur --longhelp for list of options 
            options: {
                sourceMaps: false,
                modules: 'amd'
            },
            // custom filename transformation function 
            transformPath: function(path) {
                return path.replace(/\.es6$/, '.js');
            }
        }
    });
};