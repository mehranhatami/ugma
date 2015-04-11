module.exports = function(config) {

//var traceurOptions = require('/config').traceur;
    config.set({
        basePath: "..",
        singleRun: true,
        frameworks:  ["jasmine-ajax", "jasmine"],
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
            "./test/lib/promise.js",
            "./build/ugma.js",
            "./build/xhr.js",
            "./test/modules/**/*.js"
        ]
    });
};