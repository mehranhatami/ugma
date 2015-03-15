var path = require("path"),
    through = require("through"),
    gutil = require("gulp-util"),
    PluginError = gutil.PluginError,
    es6modules = require("es6-module-transpiler"),
    recast = require("es6-module-transpiler/node_modules/recast"),
    Container = es6modules.Container,
    FileResolver = es6modules.FileResolver,
    BundleFormatter = es6modules.formatters.bundle;

module.exports = function(dest, pkg) {
    if (!dest) throw new PluginError("compile", "Missing dest option for compile");

    var container = null,
    // make a version number string, e.g. "1.20.3" -> "1020300"
      version = pkg.version.replace(/\.(\d+)/g, function(_, n) {
        return ("000" + n).slice(-3);
    }),

    // codename for package management
     codename = pkg.codename;

    function bufferContents(file) {
        if (file.isNull()) return; // ignore

        if (!container) {
            container = new Container({
                resolvers: [ new FileResolver([file.cwd]) ],
                formatter: new BundleFormatter()
            });
            // set variables to use later
            container.cwd = file.cwd;
            container.base = file.base;
        }

        container.getModule(path.relative(file.cwd, file.path));
    }

    function endStream() {
        if (!container) return;

        try {
            var ast = container.convert();
            var code = recast.print(ast[0]).code;
            // improve internal type names
            code = code.replace(/(?:errors|types)\$\$(\$?\w+)/g, "$1");
            // remove generated prefix from constants
            code = code.replace(/const\$\$/g, "");
            // fix for browserify that prohibits global this
            code = code.replace("}).call(this);", "})();\n");
            // filter source code
            code = gutil.template(code, {
                pkg: pkg,
                file: dest,
                // Make unique name 
                prop: function(name) {
                    return name ? "{{" + name + "!" + codename + "}}" : "{{" + codename + "}}";
                }
            });

            this.emit("data", new gutil.File({
                cwd: container.cwd,
                base: container.base,
                path: path.join(container.base, dest),
                contents: new Buffer(code)
            }));
        } catch (err) {
            this.emit("error", new PluginError("compile", err));
        }

        this.emit("end");
    }

    return through(bufferContents, endStream);
};
