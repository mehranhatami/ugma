var gulp = require("gulp"),
    gulpif = require("gulp-if"),
    gutil = require("gulp-util"),
    pkg = require("./package.json"),
    compile = require("./task/compile"),
    traceur = require('gulp-traceur'),    
    jshint = require("gulp-jshint"),
    argv = require("yargs").argv,
    clean = require("gulp-clean"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    bump = require("gulp-bump"),
    replace = require("gulp-replace"),
    git = require("gulp-git"),
    filter = require("gulp-filter"),
    tag_version = require("gulp-tag-version"),
    plumber = require("gulp-plumber"),
    header = require("gulp-header"),
    gzip = require( "gulp-gzip" ),
    karma = require("karma").server,
    karmaConfig = require.resolve("./conf/karma.conf"),

    banner = [
    "/**",
    " * <%= pkg.description %> <%= pkg.version %>",
    " * <%= pkg.repository.url %>",
    " * ",
    " * Copyright 2014 - " + new Date().getFullYear() + " <%= pkg.author %>",
    " * Released under the <%= pkg.license %> license",
    " * ",
    " * Build date: <%= new Date().toUTCString() %>",
    
    " */"
].join("\n");

// lint testing your build 
gulp.task("lint", function() {
    return gulp.src(["test/modules/**/*.js"])
        .pipe(jshint(require("./conf/jshintrc-test")))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(gulpif(process.env.TRAVIS_JOB_NUMBER, jshint.reporter("fail")));
});

// compile - but not minify - your build
gulp.task("compile", function() {
    var version = argv.tag,
        dest = version ? "dist/" : "build/";

    if (version) {
        pkg.version = version;
    } else {
        version = pkg.version;
    }

    return gulp.src(["modules/*.js", "emmet/*.js", "util/*.js", "*.js"], {cwd: "./src"})
        .pipe(gulpif(!process.env.TRAVIS_JOB_NUMBER, plumber()))
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(jshint.reporter("fail"))
        .pipe(compile("ugma.js", pkg))
        .pipe(traceur())
        .pipe(gulpif(dest === "dist/", replace(/\/\*([\s\S]*?)\*\/\s+/gm, "")))
        .pipe(header(banner + "\n", { pkg: pkg }))
//        .pipe(browserify())
        .pipe(gulp.dest(dest));
});

// compiles and run linting to check code quality
gulp.task("test", ["compile", "lint"], function(done) {
    var config = {preprocessors: []};

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

// make a minified version
gulp.task("minify", ["test", "zipped"], function() {
    var dest = argv.tag ? "dist/" : "build/";

    return gulp.src(dest + "ugma.js")
        .pipe(uglify({preserveComments: "some"}))
        .pipe(rename("ugma.min.js"))
        .pipe(gulp.dest(dest));
});

// make a minified version
gulp.task("zipped", ["test"], function() {
    var dest = argv.tag ? "dist/" : "build/";

    return gulp.src(dest + "ugma.js")
        .pipe(uglify({preserveComments: "some"}))
        .pipe(rename("ugma.min.js"))
        .pipe(gzip())
        .pipe(gulp.dest(dest));
});

// create a dev version
gulp.task("dev", ["compile", "lint"], function() {
    gulp.watch(["src/modules/*.js", "src/emmet/*.js", "src/util/*.js", "src/*.js"], ["compile"]);
    gulp.watch(["test/modules/**/*.js"], ["lint"]);

    karma.start({
        configFile: karmaConfig,
        reporters: ["coverage", "progress"],
        background: true,
        singleRun: false
    });
});


// 'bump' the version number
gulp.task("bump", function() {
    return gulp.src(["./*.json"])
        .pipe(bump({version: argv.tag}))
        .pipe(gulp.dest("./"));
});

// make a public release
gulp.task("publish", ["bump", "compress"], function(done) {
    var version = argv.tag;

    if (!version) throw new gutil.PluginError("release", "You need to specify --tag parameter");

    gulp.src(["./*.json", "./dist/*.js"])
        .pipe(git.commit("version " + version))
        .pipe(filter("package.json"))
        .pipe(tag_version())
        .on("end", function() {
            git.push("origin", "master", {}, function() {
                git.push("origin", "master", {args: "--tags"}, done);
            });
        });
});
