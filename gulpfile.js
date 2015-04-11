var gulp = require("gulp");

const gulpif = require("gulp-if");
const gutil = require("gulp-util");
const pkg = require("./package.json");
const compile = require("./task/compile");
const es6transpiler = require("gulp-es6-transpiler");
const jshint = require("gulp-jshint");
const jscs = require("gulp-jscs");
const mkdirp = require('mkdirp');
const argv = require("yargs").argv;
const clean = require("gulp-clean");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const git = require("gulp-git");
const filter = require("gulp-filter");
const tag_version = require("gulp-tag-version");
const plumber = require("gulp-plumber");
const header = require("gulp-header");
const notify = require("gulp-notify");
const replace = require("gulp-replace");
const karma = require("karma").server;
const karmaConfig = require.resolve("./conf/karma.conf");

// Send a notification when JSHint fails,
// so that you know your changes didn't build
function jshintNotify(file) {
  if (!file.jshint) { return; }
  return file.jshint.success ? false : 'JSHint failed';
}

function jscsNotify(file) {
  if (!file.jscs) { return; }
  return file.jscs.success ? false : 'JSRC failed';
}

// lint testing your build 
gulp.task("lint", function() {
    return gulp.src(["test/modules/**/*.js"])
        .pipe(jshint(require("./conf/jshintrc-test")))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(notify(jshintNotify))
        .pipe(jscs())
        .pipe(notify(jscsNotify))
        .pipe(gulpif(process.env.TRAVIS_JOB_NUMBER, jshint.reporter("fail")));
});

// compile XHR source file
gulp.task("xhr", function() {
   
        // Write the generated sourcemap
     mkdirp.sync("build/");

    return gulp.src(["*.js"], {
            cwd: "./plugins/xhr"
        })
        .pipe(gulpif(!process.env.TRAVIS_JOB_NUMBER, plumber()))
//        .pipe(postcss([ customProperties(), autoprefixer(autoprefixerConfig), csswring, url ]))
       // .pipe(jsFilter)
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(jshint.reporter("fail"))
        .pipe(replace(/\\|"/g, "\\$&")) // handle symbols need to escape
        .pipe(compile("xhr.js", pkg))
        .pipe(es6transpiler())
        .pipe(header(banner = [
            "/**",
            " * XHR (ajax) for ugma javascript framework <%= pkg.version %>",
            " * <%= pkg.repository.url %>",
            " * ",
            " * Copyright 2014 - " + new Date().getFullYear() + " <%= pkg.author %>",
            " * Released under the <%= pkg.license %> license",
            " * ",
            " * Build date: <%= new Date().toUTCString() %>",
            " */"
        ].join("\n") + "\n", {
            pkg: pkg
        }))
        //        .pipe(browserify())
        .pipe(gulp.dest("build/"));
});

// compile - but not minify - your build
// compile XHR module in the same time
gulp.task("compile", ["xhr"], function() {
   
        // Write the generated sourcemap
     mkdirp.sync("build/");

    return gulp.src(["modules/*.js", "template/*.js", "core/*.js", "util/*.js", "*.js"], {
            cwd: "./src"
        })
        .pipe(gulpif(!process.env.TRAVIS_JOB_NUMBER, plumber()))
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(jshint.reporter("fail"))
        .pipe(replace(/\\|"/g, "\\$&")) // handle symbols need to escape
        .pipe(compile("ugma.js", pkg))
        .pipe(es6transpiler())
        .pipe(header(banner = [
            "/**",
            " * <%= pkg.description %> <%= pkg.version %>",
            " * <%= pkg.repository.url %>",
            " * ",
            " * Copyright 2014 - " + new Date().getFullYear() + " <%= pkg.author %>",
            " * Released under the <%= pkg.license %> license",
            " * ",
            " * Build date: <%= new Date().toUTCString() %>",
            " */"
        ].join("\n") + "\n", {
            pkg: pkg
        }))
        //        .pipe(browserify())
        .pipe(gulp.dest("build/"));
});

// compiles and run linting to check code quality
gulp.task("test", ["compile", "lint"], function(done) {
    var config = {
        preprocessors: []
    };

    if (process.env.TRAVIS_JOB_NUMBER) {
        config = {
            reporters: ["coverage", "dots", "coveralls"],
            coverageReporter: {
                type: "lcovonly",
                dir: "coverage/"
            }
        };
    } else {
        if (argv.all) {
            config.browsers = ["PhantomJS", "Chrome", "ChromeCanary", "Opera", "Safari", "Firefox"];
        } else if (argv.ie9 || argv.ie10 || argv.ie11) {
            config.browsers = ["IE" + (argv.ie9 ? "9" : (argv.ie10 ? "10" : "11")) + " - Win7"];
        }
    }

    config.configFile = karmaConfig;

    karma.start(config, function(resultCode) {
        done(resultCode ? new gutil.PluginError("karma", "Tests failed") : null);
    });
});


// make a minified version of XHR
gulp.task("minifyXHR", ["test"], function() {
    var dest = argv.tag ? "dist/" : "build/";

    return gulp.src(dest + "xhr.js")
        .pipe(uglify({
            preserveComments: "some"
        }))
        .pipe(rename("xhr.min.js"))
        .pipe(gulp.dest(dest));
});

// make a minified version
gulp.task("minify", ["minifyXHR", "test"], function() {
    var dest = argv.tag ? "dist/" : "build/";

    return gulp.src(dest + "ugma.js")
        .pipe(uglify({
            preserveComments: "some"
        }))
        .pipe(rename("ugma.min.js"))
        .pipe(gulp.dest(dest));
});

// create a dev version
gulp.task("dev", ["compile", "lint"], function() {
    gulp.watch(["src/modules/*.js", "src/template/*.js", "src/core/*.js", "src/util/*.js", "src/*.js"], ["compile"]);
    gulp.watch(["test/modules/**/*.js"], ["lint"]);

    karma.start({
        configFile: karmaConfig,
        reporters: ["coverage", "progress"],
        background: true,
        singleRun: false
    });
});

// make a public release
gulp.task("publish", ["compress"], function(done) {
    var version = argv.tag;

    if (!version) throw new gutil.PluginError("release", "You need to specify --tag parameter");

    gulp.src(["./*.json", "./dist/*.js"])
        .pipe(git.commit("version " + version))
        .pipe(filter("package.json"))
        .pipe(tag_version())
        .on("end", function() {
            git.push("origin", "master", {}, function() {
                git.push("origin", "master", {
                    args: "--tags"
                }, done);
            });
        });
});