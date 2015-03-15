/**
 * ugma javascript framework 0.5.0a
 * https://github.com/ugma/ugma
 * 
 * Copyright 2014 - 2015 Kenny Flashlight
 * Released under the MIT license
 * 
 * Build date: Sun, 15 Mar 2015 13:11:38 GMT
 */
(function() {
    "use strict";var SLICE$0 = Array.prototype.slice;
    // Support: IE< 10
    if (INTERNET_EXPLORER < 10) {
    
        // Throw if IE8
        if (INTERNET_EXPLORER < 9) {
            throw Error("Ugma Framework does not support IE8 and older IE versions");
        }
    
        if (DOCUMENT.documentMode) {
            //  If we"re in IE9, check to see if we are in combatibility mode and provide
            // information on preventing it
            WINDOW.console.warn("Internet Explorer is running in compatibility mode, please add the following " +
                "tag to your HTML to prevent this from happening: " +
                "<meta http-equiv='X-UA-Compatible' content='IE=edge' />"
            );
        }
    }

    function Node() {}

    // Ugma are presented as a node tree similar to DOM Living specs,
    // and it is represented as follows:
    //  
    //
    // |_ Document   (ugma)
    // |
    // |_ Node ( dummy functions)
    // |
    // |_ Element
    //     |- nodes  
    //
    // All functions and methods are attched to current document, and not
    // available in other documents / another document tree.
    //
    // As a paralell to this the Shadow() method create shadow DOM elements on a new
    // document, and create it's own document tree, and methods. 
    // http://www.w3.org/TR/shadow-dom/

    function Element(node) {
        if (this instanceof Element) {
            if (node) {
                node["{{trackira}}"] = this;
    
                this[0] = node;
                this._ = {};
            }
        } else if (node) {
            // create a wrapper only once for each native element
            return node["{{trackira}}"] || new Element(node);
        } else {
            return new Node();
        }
    }

    // Set correct document, and determine what kind it is.
    function Document(node) {
        return Element.call(this, node.documentElement);
    }

    Element.prototype = {
        // all of these placeholder strings will be replaced by gulps's
        version: "0.5.0a",
        codename: "trackira",
    
        toString: function() {
            var node = this[0];
            return node && node.tagName ? "<" + node.tagName.toLowerCase() + ">" : "";
        },
    };

    Node.prototype = new Element();
    Node.prototype.toString = function()  {return ""};

    Document.prototype = new Element();
    // we are only interested in elements (1) because they are the root 
    // element, and will be referred to as the '<document>'.
    //
    // Example:  
    //
    // console.log(umga) 
    // 
    // will output: '<document>'

    Document.prototype.toString = function()  {return "<document>"};

    var WINDOW = window;
    var DOCUMENT = document;
    var HTML = DOCUMENT.documentElement;
    var RCSSNUM = /^(?:([+-])=|)([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))([a-z%]*)$/i;

    var ERROR_MSG = {
        1: "The string did not match the expected pattern",
        2: "The string contains invalid characters.",
        3: "Wrong amount of arguments.",
        4: "This operation is not supported",
        6: "The property or attribute is not valid.",
        7: "The first argument need to be a string"
    };

    var INTERNET_EXPLORER = document.documentMode;

    var RETURN_THIS = function() {return this};
    var RETURN_TRUE = function()  {return true};
    var RETURN_FALSE = function()  {return false};
    var GINGERBREAD = /Android 2\.3\.[3-7]/i.test(WINDOW.navigator.userAgent);
    var VENDOR_PREFIXES = ["Webkit", "Moz", "ms", "O"];
    var WEBKIT_PREFIX = WINDOW.WebKitAnimationEvent ? "-webkit-" : "";


    // Set a new document, and define a local copy of ugma
    var ugma = new Document(DOCUMENT);

    var toolset$$arrayProto = Array.prototype;

    var toolset$$every = toolset$$arrayProto.every;
    var toolset$$slice = toolset$$arrayProto.slice;
    var toolset$$isArray = Array.isArray;
    var toolset$$keys = Object.keys;

    function toolset$$each(array, callback) {
        if (array && callback) {
            var index = -1,
                length = array.length;
    
            while (++index < length) {
                if (callback(array[index], index, array) === false) {
                    break;
                }
            }
        }
        return array;
    }

    function toolset$$map(collection, callback) {
        if (collection) {
    
            var result = [];
            toolset$$each(collection, function(value, key)  {
                result.push(callback(value, key));
            });
            return result;
        }
        return null;
    }

    function toolset$$reduce(array, iteratee, accumulator, initFromArray) {
        var index = -1,
            length = array.length;
    
        if (initFromArray && length) {
            accumulator = array[++index];
        }
        while (++index < length) {
            accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
    }

    function toolset$$forOwn(obj, callback) {
            if (obj) {
                var i = 0;
                for (i in obj) {
                    if (callback(i, obj[i]) === false) {
                        break;
                    }
                }
            }
            return obj;
        }
    function toolset$$filter(collection, predicate) {
        var result = [];
        toolset$$forOwn(collection, function(index, value)  {
            if (predicate(value, index, collection)) {
                result.push(value);
            }
        });
        return result;
    }

    function toolset$$is(obj, type) {
        // Support: IE11
        // Avoid a Chakra JIT bug in compatibility modes of IE 11.
        // https://github.com/jashkenas/underscore/issues/1621 for more details.
        return type === "function" ?
            typeof obj === type || false :
            typeof obj === type;
    }

    // Support: Android<4.1
    // Make sure we trim BOM and NBSP
    var toolset$$atrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    function toolset$$trim(text) {
        return text == null ?
            "" :
            (text + "").replace(toolset$$atrim, "");
    }

    function toolset$$invoke(context, fn, arg1, arg2) {
        if (typeof fn === "string") fn = context[fn];
    
        try {
            return fn.call(context, arg1, arg2);
        } catch (err) {
            /* istanbul ignore next */
            WINDOW.setTimeout(function()  {
                throw err;
            }, 1);
    
            return false;
        }
    }

    function toolset$$implement(obj, callback, mixin) {
            if (toolset$$is(obj, "object")) {
                var proto = (mixin ? Element : Document).prototype;
    
                if (!callback) {
                    callback = function(method, strategy) {
                        return strategy;
                    };
                }
                toolset$$forOwn(obj, function(method, func)  {
                    var args = [method].concat(func);
                    proto[method] = callback.apply(null, args);
    
                    if (mixin) {
                        Node.prototype[method] = mixin.apply(null, args);
                    }
                });
            }
        }
    function toolset$$convertArgs(arg) {
        var i = arg.length,
            args = new Array(i || 0);
        while (i--) {
            args[i] = arg[i];
        }
        return args;
    }

    var toolset$$reDash = /([\:\-\_]+(.))/g;

    var toolset$$mozHack = /^moz([A-Z])/;

    function toolset$$camelize(prop) {
        return prop && prop.replace(toolset$$reDash, function(_, separator, letter, offset)  {
            return offset ? letter.toUpperCase() : letter;
        }).replace(toolset$$mozHack, "Moz$1");
    }

    function toolset$$computeStyle(node, pseudoElement) {
        /* istanbul ignore if */
            pseudoElement = pseudoElement ? pseudoElement : "";
            // Support: IE<=11+, Firefox<=30+
            // IE throws on elements created in popups
            // FF meanwhile throws on frame elements through 'defaultView.getComputedStyle'
            if (node.ownerDocument.defaultView.opener) {
                return (node.ownerDocument.defaultView ||
                    // This will work if the ownerDocument is a shadow DOM element
                    DOCUMENT.defaultView).getComputedStyle(node, pseudoElement);
            }
            return WINDOW.getComputedStyle(node, pseudoElement);
    }

    function toolset$$injectElement(node) {
            if (node && node.nodeType === 1) {
                return node.ownerDocument.head.appendChild(node);
            }
    }
    function minErr$$minErr(module, msg) {var this$0 = this;
        var wrapper = function()  {
            this$0.message = module ? (msg ? msg : ERROR_MSG[4]) +
                (module.length > 4 ? " -> Module: " + module : " -> Core ") : ERROR_MSG[1];
            // use the name on the framework
            this$0.name = "ugma";
        };
        wrapper.prototype = Object.create(Error.prototype);
        throw new wrapper(module, msg);
    }
    /* es6-transpiler has-iterators:false, has-generators: false */

    var // operator type / priority object
        public$emmet$$operators = {"(": 1,")": 2,"^": 3,">": 4,"+": 5,"*": 6,"`": 7,"[": 8,".": 8,"#": 8},
        public$emmet$$reParse = /`[^`]*`|\[[^\]]*\]|\.[^()>^+*`[#]+|[^()>^+*`[#.]+|\^+|./g,
        public$emmet$$reAttr = /\s*([\w\-]+)(?:=((?:`([^`]*)`)|[^\s]*))?/g,
        public$emmet$$reIndex = /(\$+)(?:@(-)?(\d+)?)?/g,
        public$emmet$$reDot = /\./g,
        public$emmet$$reDollar = /\$/g,
        public$emmet$$tagCache = {"": ""},
        public$emmet$$parseAttr = function(_, name, value, rawValue)  {
            // try to detemnie which kind of quotes to use
            var quote = value && value.indexOf("\"") >= 0 ? "'" : "\"";
    
            if (toolset$$is(rawValue, "string")) {
                // grab unquoted value for smart quotes
                value = rawValue;
            } else if (!toolset$$is(value, "string")) {
                // handle boolean attributes by using name as value
                value = name;
            }
            // always wrap attribute values with quotes even they don't exist
            return " " + name + "=" + quote + value + quote;
        },
        public$emmet$$injection = function(term, adjusted)  {return function(html)  {
            // find index of where to inject the term
            var index = adjusted ? html.lastIndexOf("<") : html.indexOf(">");
            // inject the term into the HTML string
            return html.slice(0, index) + term + html.slice(index);
        }},
        public$emmet$$processTag = function(tag)  {
            return public$emmet$$tagCache[tag] || (public$emmet$$tagCache[tag] = "<" + tag + "></" + tag + ">");
        },
       
       
        public$emmet$$indexing = function(num, term)  {
           var stricted = num >= 1500 ? /* max 1500 HTML elements */ 1500 : (num <= 0 ? 1 : num),
               result = new Array(stricted),
              i = 0;
    
            for (;i < num; ++i) {
                result[i] = term.replace(public$emmet$$reIndex, function(expr, fmt, sign, base)  {
                    var index = (sign ? num - i - 1 : i) + (base ? +base : 1);
                    // handle zero-padded index values, like $$$ etc.
                    return (fmt + index).slice(-fmt.length).replace(public$emmet$$reDollar, "0");
                });
            }
            return result;  
        },
        public$emmet$$badChars = /[&<>"']/g,
        // http://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
        public$emmet$$charMap = {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"};

    // populate empty tag names with result
    "area base br col hr img input link meta param command keygen source".split(" ").forEach(function(tag)  {
        public$emmet$$tagCache[tag] = "<" + tag + ">";
    });

    ugma.emmet = function(template, varMap) {var $D$0;var $D$1;var $D$2;
    
        if (!toolset$$is(template, "string")) minErr$$minErr("emmet()", ERROR_MSG[2]);
    
        if (varMap) template = ugma.format(template, varMap);
     // If already cached, return the cached result
        if (template in public$emmet$$tagCache) {return public$emmet$$tagCache[template];}
    
        // transform template string into RPN
    
        var stack = [], output = [];
    
    
        $D$2 = (template.match(public$emmet$$reParse));$D$0 = 0;$D$1 = $D$2.length;for (var str ;$D$0 < $D$1;){str = ($D$2[$D$0++]);
            var op = str[0];
            var priority = public$emmet$$operators[op];
    
            if (priority) {
                if (str !== "(") {
                    // for ^ operator need to skip > str.length times
                    for (var i = 0, n = (op === "^" ? str.length : 1); i < n; ++i) {
                        while (stack[0] !== op && public$emmet$$operators[stack[0]] >= priority) {
                            var head = stack.shift();
    
                            output.push(head);
                            // for ^ operator stop shifting when the first > is found
                            if (op === "^" && head === ">") break;
                        }
                    }
                }
    
                if (str === ")") {
                    stack.shift(); // remove "(" symbol from stack
                } else {
                    // handle values inside of `...` and [...] sections
                    if (op === "[" || op === "`") {
                        output.push(str.slice(1, -1));
                    }
                    // handle multiple classes, e.g. a.one.two
                    if (op === ".") {
                        output.push(str.slice(1).replace(public$emmet$$reDot, " "));
                    }
    
                    stack.unshift(op);
                }
            } else {
                output.push(str);
            }
        };$D$0 = $D$1 = $D$2 = void 0;
    
        output = output.concat(stack);
    
        // transform RPN into html nodes
    
        stack = [];
    
        $D$0 = 0;$D$1 = output.length;for (var str$0 ;$D$0 < $D$1;){str$0 = (output[$D$0++]);
            if (str$0 in public$emmet$$operators) {
                var value = stack.shift();
                var node = stack.shift();
    
                if (typeof node === "string") {
                    node = [ public$emmet$$processTag(node) ];
                }
    
               if (toolset$$is(node, "undefined") || toolset$$is(value, "undefined")) {
                   minErr$$minErr("emmet()", ERROR_MSG[4]);
               }
                        
                if(str$0 === ".") { // class
                    value = public$emmet$$injection(" class=\"" + value + "\"");            
                } else if(str$0 === "#") { // id
                    value = public$emmet$$injection(" id=\"" + value + "\"");
                } else if(str$0 === "[") { // id
                    value = public$emmet$$injection(value.replace(public$emmet$$reAttr, public$emmet$$parseAttr));
                } else if(str$0 === "*") { // universal selector 
                    node = public$emmet$$indexing(+value, node.join(""));
                } else if(str$0 === "`") { // Back tick
                    stack.unshift(node);
                    // escape unsafe HTML symbols
                    node = [ value.replace(public$emmet$$badChars, function(ch)  {return public$emmet$$charMap[ch]}) ];
                } else {  /* ">", "+", "^" */
                    value = toolset$$is(value, "string") ? public$emmet$$processTag(value) : value.join("");
    
                    if (str$0 === ">") {
                        value = public$emmet$$injection(value, true);
                    } else {
                        node.push(value);
                    }
                    }
    
                str$0 = toolset$$is(value, "function") ? node.map(value) : node;
            }
    
            stack.unshift(str$0);
        };$D$0 = $D$1 = void 0;
    
        if (output.length === 1) {
            // handle single tag case
            output = public$emmet$$processTag(stack[0]);
        } else {
            output = stack[0].join("");
        }
    
        return output;
    };

    var public$emmet$$default = public$emmet$$tagCache;

    // 'format' a placeholder value with it's original content 
    // @example
    // ugma.format('{0}-{1}', [0, 1]) equal to '0-1')
    var public$format$$reVar = /\{([\w\-]+)\}/g;
    ugma.format = function(tmpl, varMap) {
        if (!toolset$$is(tmpl, "string")) tmpl = String(tmpl);
    
        if (!varMap || !toolset$$is(varMap, "object")) varMap = {};
    
        return tmpl.replace(public$format$$reVar, function(x, name, index)  {
            if (name in varMap) {
                x = varMap[name];
    
                if (toolset$$is(x, "function")) x = x(index);
    
                x = String(x);
            }
    
            return x;
        });
    };

    var public$frame$$global = WINDOW;
    // Test if we are within a foreign domain. Use raf from the top if possible.
    /* jshint ignore:start */
    try {
        // Accessing .name will throw SecurityError within a foreign domain.
        public$frame$$global.top.name;
        public$frame$$global = public$frame$$global.top;
    } catch (e) {}
    /* jshint ignore:end */
    // Works around a iOS6 bug
    var public$frame$$raf = public$frame$$global.requestAnimationFrame,
        public$frame$$craf = public$frame$$global.cancelAnimationFrame,
        public$frame$$lastTime = 0;

    if (!(public$frame$$raf && !public$frame$$craf)) {
        toolset$$each(VENDOR_PREFIXES, function(prefix)  {
            prefix = prefix.toLowerCase();
            public$frame$$raf = public$frame$$raf || WINDOW[prefix + "RequestAnimationFrame"];
            public$frame$$craf = public$frame$$craf || WINDOW[prefix + "CancelAnimationFrame"];
        });
    }

    // Executes a callback in the next frame
    ugma.requestFrame = function(callback)  {
        /* istanbul ignore else */
        if (public$frame$$raf) {
            return public$frame$$raf.call(public$frame$$global, callback);
        } else {
            // Dynamically set delay on a per-tick basis to match 60fps.
            var currTime = Date.now(),
                timeDelay = Math.max(0, 16 - (currTime - public$frame$$lastTime)); // 1000 / 60 = 16.666

            public$frame$$lastTime = currTime + timeDelay;

            return public$frame$$global.setTimeout(function()  {
                callback(currTime + timeDelay);
            }, timeDelay);
        }
    };

    // Works around a rare bug in Safari 6 where the first request is never invoked.
    ugma.requestFrame(function() {return function() {}});

    // Cancel a scheduled frame
    ugma.cancelFrame = function(frameId)  {
        /* istanbul ignore else */
        if (public$frame$$craf) {
            public$frame$$craf.call(public$frame$$global, frameId);
        } else {
            public$frame$$global.clearTimeout(frameId);
        }
    };

    // Create a ugma wrapper object for a native DOM element or a
    // jQuery element. E.g. (ugma.native($('#foo')[0]))
    ugma.native = function(node)  {
        var nodeType = node && node.nodeType;
        // filter non elements like text nodes, comments etc.
        return (((nodeType === 9 ? Document : Element))
            )
            (
                nodeType === 1 ||
                nodeType === 9 ?
                node :
                null
            );
    };

    toolset$$implement({
        // Append global css styles
        injectCSS: function(selector, cssText) {
            var styleSheet = this._["{{styles!trackira}}"];
    
            if (!styleSheet) {
                var doc = this[0].ownerDocument,
                    styleNode = toolset$$injectElement(doc.createElement("style"));
    
                styleSheet = styleNode.sheet || styleNode.styleSheet;
                // store object internally
                this._["{{styles!trackira}}"] = styleSheet;
            }
    
            if (!toolset$$is(selector, "string") || !toolset$$is(cssText, "string")) {
                minErr$$minErr("injectCSS()", ERROR_MSG[1]);
            }
    
            toolset$$each(selector.split(","), function(selector) {
                try {
                   styleSheet.insertRule(selector + "{" + cssText + "}", styleSheet.cssRules.length);
                } catch(err) {}
            });
        }
    });

    toolset$$implement({
        // Import external javascript files in the document, and call optional 
        // callback when it will be done. 
        injectScript: function() {var urls = SLICE$0.call(arguments, 0);
            var doc = this[0].ownerDocument;
    
            var callback = function()  {
                var arg = urls.shift(),
                    argType = typeof arg,
                    script;
    
                if (toolset$$is(arg, "string")) {
                    
                    script = doc.createElement("script");
                    script.onload = callback;
     
                   // Support: IE9
                   // Bug in IE force us to set the 'src' after the element has been
                   // added to the document.
                    
                    toolset$$injectElement(script);
    
                    script.src = arg;
                    script.async = true;
                    script.type = "text/javascript";
                    
                } else if (toolset$$is(arg, "function")) {
                    arg();
                } else if (arg) {
                    minErr$$minErr("injectScript()", ERROR_MSG[3]);
                }
            };
    
            callback();
        }
    });

    toolset$$implement({
       // Assign a new attribute for the current element
        assign: function(name, getter, setter) {var this$0 = this;
            var node = this[0];
    
             if (!toolset$$is(name, "string") || !toolset$$is(getter, "function") || !toolset$$is(setter, "function")) {
                minErr$$minErr("assign()", ERROR_MSG[5]);
            }
    
            var attrName = name.toLowerCase(),
             _setAttribute = node.setAttribute,
             _removeAttribute = node.removeAttribute;
    
            Object.defineProperty(node, name, {
                get: function()  {
                    var attrValue = node.getAttribute(attrName, 1);
                    // attr value -> prop value
                    return getter.call(this$0, attrValue);
                },
                set: function(propValue)  {
                    // prop value -> attr value
                    var attrValue = setter.call(this$0, propValue);
    
                    if (attrValue == null) {
                        _removeAttribute.call(node, attrName, 1);
                    } else {
                        _setAttribute.call(node, attrName, attrValue, 1);
                    }
                }
            });
    
            // override methods to catch changes from attributes too
            node.setAttribute = function(name, value, flags)  {
                if (attrName === name.toLowerCase()) {
                    node[name] = getter.call(this$0, value);
                } else {
                    _setAttribute.call(node, name, value, flags);
                }
            };
    
            node.removeAttribute = function(name, flags)  {
                if (attrName === name.toLowerCase()) {
                    node[name] = getter.call(this$0, null);
                } else {
                    _removeAttribute.call(node, name, flags);
                }
            };
    
            return this;
        }
    }, null, function()  {return RETURN_THIS});

    /* es6-transpiler has-iterators:false, has-generators: false */

    // Helper for css selectors

    var util$selectormatcher$$rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,
        util$selectormatcher$$propName = VENDOR_PREFIXES.concat(null)
            .map(function(p)  {return (p ? p.toLowerCase() + "M" : "m") + "atchesSelector"})
            .reduceRight(function(propName, p)  {return propName || p in HTML && p}, null);

    var util$selectormatcher$$default = function(selector, context) {
        if (typeof selector !== "string") return null;

        var quick = util$selectormatcher$$rquickIs.exec(selector);

        if (quick) {
            // Quick matching is inspired by jQuery:
            //   0  1    2   3          4
            // [ _, tag, id, attribute, class ]
            if (quick[1]) quick[1] = quick[1].toLowerCase();
            if (quick[3]) quick[3] = quick[3].split("=");
            if (quick[4]) quick[4] = " " + quick[4] + " ";
        }

        return function(node) {var $D$3;var $D$4;
            var result, found;
            /* istanbul ignore if */
            if (!quick && !util$selectormatcher$$propName) {
                found = (context || node.ownerDocument).querySelectorAll(selector);
            }

            for (; node && node.nodeType === 1; node = node.parentNode) {
                if (quick) {
                    result = (
                        (!quick[1] || node.nodeName.toLowerCase() === quick[1]) &&
                        (!quick[2] || node.id === quick[2]) &&
                        (!quick[3] || (quick[3][1] ? node.getAttribute(quick[3][0]) === quick[3][1] : node.hasAttribute(quick[3][0]))) &&
                        (!quick[4] || (" " + node.className + " ").indexOf(quick[4]) >= 0)
                    );
                } else {
                    /* istanbul ignore else */
                    if (util$selectormatcher$$propName) {
                        result = node[util$selectormatcher$$propName](selector);
                    } else {
                        $D$3 = 0;$D$4 = found.length;for (var n ;$D$3 < $D$4;){n = (found[$D$3++]);
                            if (n === node) return n;
                        };$D$3 = $D$4 = void 0;
                    }
                }

                if (result || !context || node === context) break;
            }

            return result && node;
        };
    };

    toolset$$implement({
            // returns the first child node in a collection of children
        child: false,
            // returns all child nodes in a collection of children
        children: true
    
    }, function(methodName, all)  {return function(selector) {
            if (selector && (!toolset$$is(selector, all ? "string" : "number"))) {
                minErr$$minErr(methodName + "()", selector + " is not a " + (all ? " string" : " number") + " value");
            }
    
        var node = this[0],
            matcher = util$selectormatcher$$default(selector),
            children = node.children;
    
        if (all) {
            if (matcher) children = toolset$$filter(children, matcher);
    
            return toolset$$map(children, Element);
        } else {
            if (selector < 0) selector = children.length + selector;
    
            return Element(children[selector]);
        }
    }}, function(methodName, all)  {return function()  {return all ? [] : new Node()}});

    /* es6-transpiler has-iterators:false, has-generators: false */
    var modules$classes$$reClass = /[\n\t\r]/g;
    var modules$classes$$whitespace = /\s/g;

    toolset$$implement({
        // Adds a class or an array of class names, e.g.:
        // ["no-work", "candybar", ...] to the element if 
        // it doesn't already have it
        addClass: ["add", true, function(node, token)  {
            var existingClasses = (" " + node[0].className + " ")
                .replace(modules$classes$$reClass, " ");
    
            if (existingClasses.indexOf(" " + token + " ") === -1) {
                existingClasses += toolset$$trim(token) + " ";
            }
    
            node[0].className = toolset$$trim(existingClasses);
        }],
    
        // Remove any class or an array of class names names that match the 
        // given `class`, when present.
        removeClass: ["remove", true, function(node, token)  {
            node[0].className = toolset$$trim(
                (" " + node[0].className + " ")
                .replace(modules$classes$$reClass, " ")
                .replace(" " + toolset$$trim(token) + " ", " "));
        }],
    
        // Check if the given `class` is in the class list.
        hasClass: ["contains", false, function(node, token)  {
            return ((" " + node[0].className + " ").replace(modules$classes$$reClass, " ").indexOf(" " + token + " ") > -1);
        }],
    
        // Toggle the `class` in the class list. Optionally force state via `condition`.
        toggleClass: ["toggle", false, function(el, token)  {
            var hasClass = el.hasClass(token);
    
            if (hasClass) {
                el.removeClass(token);
            } else {
                el[0].className += " " + token;
            }
    
            return !hasClass;
        }]
    }, function(methodName, nativeMethodName, multiClass, strategy)  {
    
        // Support: Webkit, Gecko
        var supportMultipleArgs = (function() {
            try {
                var div = DOCUMENT.createElement("div");
                div.classList.add("a", "b");
                return /(^| )a( |$)/.test(div.className) && /(^| )b( |$)/.test(div.className);
            } catch (err) {
                return false;
            }
        }());
    
        /* istanbul ignore else  */
        if (HTML.classList) {
            // use native classList property if possible
            strategy = function(el, token) {
                return el[0].classList[nativeMethodName](token);
            };
        }
    
        if (!multiClass) {
            return function(token, force) {
                if (typeof force === "boolean" && nativeMethodName === "toggle") {
                    this[force ? "addClass" : "removeClass"](token);
    
                    return force;
                }
    
                if (typeof token !== "string") minErr$$minErr(nativeMethodName + "()", "The class provided is not a string.");
    
                return strategy(this, token);
            };
        } else {
    
            return function() {var $D$5;var $D$6;
                var tokens;
                if (supportMultipleArgs && multiClass) {
                    tokens = toolset$$convertArgs(arguments);
                    // Throw if the token contains whitespace (e.g. 'hello world' or 'crazy mehran')
                    if (modules$classes$$whitespace.test(tokens)) {
                        minErr$$minErr(nativeMethodName + "()", "The class provided contains HTML space " +
                            "characters, which are not valid.");
                    }
                    this[0].classList[nativeMethodName === "removeClass" ? "remove" : "add"].apply(this[0].classList, tokens);
                } else {
                    tokens = arguments;
                    $D$5 = 0;$D$6 = tokens.length;for (var token ;$D$5 < $D$6;){token = (tokens[$D$5++]);
                        if (typeof token !== "string") minErr$$minErr(nativeMethodName + "()", "The class provided is not a string.");
    
                        strategy(this, token);
                    };$D$5 = $D$6 = void 0;
                }
               return this;
            };
        }
    }, function(methodName, nativeMethodName) {
        if (nativeMethodName === "contains" ||
            nativeMethodName === "toggle") {
            return function()  {return RETURN_FALSE};
        }
        return function()  {return RETURN_THIS};
    });

    toolset$$implement({
            // Returns a copy of node. If deep is true, the copy 
            // also includes the node's descendants.
    
        clone: function(deep) {
             if (!toolset$$is(deep, "boolean")) minErr$$minErr("clone()", "The object can not be cloned.");
    
                return new Element(this[0].cloneNode(deep));
        }
    }, null, function()  {return function()  {return new Node()}});

    toolset$$implement({
        // Find parent element filtered by optional selector 
        // Following the Element#closest specs  
        // https://dom.spec.whatwg.org/#dom-element-closest 
        closest: function(selector) {
            if (selector && !toolset$$is(selector, "string")) minErr$$minErr("closest()", ERROR_MSG[1]);
    
            var matcher = util$selectormatcher$$default(selector),
                currentNode = this[0];
    
            if (!matcher) {
                currentNode = currentNode.parentElement;
            }
    
            for (; currentNode; currentNode = currentNode.parentElement) {
                if (currentNode.nodeType === 1 && (!matcher || matcher(currentNode))) {
                    break;
                }
            }
    
            return Element(currentNode);
        }
    }, null, function()  {return function()  {return new Node()}});

    toolset$$implement({
        // Test whether an element contains another element in the DOM.
        contains: function(other) {
            // Let reference be the context object.
            var reference = this[0];
    
            if (other instanceof Element || (other && other.nodeType === 1)) {
                other = (other.nodeType === 1) ? other : other[0];
                // If other and reference are the same object, return zero.
                if (other === reference) return 0;
    
                /* istanbul ignore else */
                if (reference.contains) {
                    return reference.contains(other) !== null;
                }
                // Return true if reference is an ancestor of other.
                return !!(reference.compareDocumentPosition(other) & 16); // 10 in hexadecimal
            }
            minErr$$minErr("contains()", "Comparing position against non-Node values is not allowed.");
        }
    }, null, function()  {return RETURN_FALSE});

    toolset$$implement({
        // Create a new Element from Emmet or HTML string in memory
        create: "",
        // Create a new array of Element from Emmet or HTML string in memory
        createAll: "All"
    
    }, function(methodName, all)  {return function(value, varMap) {
        var doc = this[0].ownerDocument,
            sandbox = this._["{{sandbox!trackira}}"];
    
        if (!sandbox) {
            sandbox = doc.createElement("div");
            this._["{{sandbox!trackira}}"] = sandbox;
        }
    
        var nodes, el;
    
        if (value && value in public$emmet$$default) {
    
            if (!toolset$$is(value, "string")) {
                minErr$$minErr(methodName + "()", ERROR_MSG[7]);
            }
    
            nodes = doc.createElement(value);
    
            if (all) nodes = [new Element(nodes)];
        } else {
            value = value.trim();
    
            if (value[0] === "<" && value[value.length - 1] === ">" && value.length >= 3) {
                value = varMap ? ugma.format(value, varMap) : value;
            } else {
                value = ugma.emmet(value, varMap);
            }
    
            sandbox.innerHTML = value; // parse input HTML string
    
            for (nodes = all ? [] : null; el = sandbox.firstChild;) {
                sandbox.removeChild(el); // detach element from the sandbox
    
                if (el.nodeType === 1) {
                    if (all) {
                        nodes.push(new Element(el));
                    } else {
                        nodes = el;
    
                        break; // stop early, because need only the first element
                    }
                }
            }
        }
    
        return all ? nodes : Element(nodes);
    }});

    // Helper for CSS properties access

    var util$csshooks$$cssHooks = {get: {}, set: {}, _default: function(name, style) {
            var propName = toolset$$camelize(name);
    
            if (!(propName in style)) {
                propName = toolset$$filter(toolset$$map(VENDOR_PREFIXES, function(prefix)  {return prefix + propName[0].toUpperCase() + propName.slice(1)}), function(prop)  {return prop in style})[0];
            }
    
            return this.get[name] = this.set[name] = propName;
        }},
        util$csshooks$$directions = ["Top", "Right", "Bottom", "Left"],
        util$csshooks$$shortCuts = {
            font: ["fontStyle", "fontSize", "/", "lineHeight", "fontFamily"],
            borderRadius: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
            padding: toolset$$map(util$csshooks$$directions, function(dir)  {return "padding" + dir}),
            margin: toolset$$map(util$csshooks$$directions, function(dir)  {return "margin" + dir}),
            "border-width": toolset$$map(util$csshooks$$directions, function(dir)  {return "border" + dir + "Width"}),
            "border-style": toolset$$map(util$csshooks$$directions, function(dir)  {return "border" + dir + "Style"})
        };

    // Don't automatically add 'px' to these possibly-unitless properties
    toolset$$each(("box-flex box-flex-group column-count flex flex-grow flex-shrink order orphans " +
        "color richness volume counter-increment float reflect stop-opacity " +
        "float fill-opacity font-weight line-height opacity orphans widows z-index zoom " +
        // SVG-related properties
        "stop-opacity stroke-mitrelimit stroke-opacity fill-opacity").split(" "), function(propName)  {
    var stylePropName = toolset$$camelize(propName);

    if (propName === "float") {
        stylePropName = "cssFloat" in HTML.style ? "cssFloat" : "styleFloat";
        // normalize float css property
        util$csshooks$$cssHooks.get[propName] = util$csshooks$$cssHooks.set[propName] = stylePropName;
    } else {
        util$csshooks$$cssHooks.get[propName] = stylePropName;
        util$csshooks$$cssHooks.set[propName] = function(value, style)  {
            style[stylePropName] = value.toString();
        };
    }
});

    // normalize property shortcuts
    toolset$$forOwn(util$csshooks$$shortCuts, function(key, props)  {
    
        util$csshooks$$cssHooks.get[key] = function(style)  {
            var result = [],
                hasEmptyStyleValue = function(prop, index)  {
                    result.push(prop === "/" ? prop : style[prop]);
    
                    return !result[index];
                };
    
            return props.some(hasEmptyStyleValue) ? "" : result.join(" ");
        };
    
        util$csshooks$$cssHooks.set[key] = function(value, style)  {
            if (value && "cssText" in style) {
                // normalize setting complex property across browsers
                style.cssText += ";" + key + ":" + value;
            } else {
               toolset$$each(props, function(name)  {return style[name] = typeof value === "number" ? value + "px" : value.toString()});
            }
        };
    });

    var util$csshooks$$default = util$csshooks$$cssHooks;
    var util$adjustCSS$$adjustCSS = function (root, prop, parts, computed) {
    
        var adjusted,
            scale = 1,
            maxIterations = 20,
            currentValue = function() {
                return parseFloat(computed[prop]);
            },
            initial = currentValue(),
            unit = parts && parts[3] || "",
            // Starting value computation is required for potential unit mismatches
            initialInUnit = (unit !== "px" && +initial) && RCSSNUM.exec(computed[prop]);
    
        if (initialInUnit && initialInUnit[3] !== unit) {
    
            unit = unit || initialInUnit[3];
    
            parts = parts || [];
    
            // Iteratively approximate from a nonzero starting point
            initialInUnit = +initial || 1;
    
            do {
                // If previous iteration zeroed out, double until we get *something*.
                // Use string for doubling so we don't accidentally see scale as unchanged below
                scale = scale || ".5";
    
                // Adjust and apply
                initialInUnit = initialInUnit / scale;
                root.css(prop, initialInUnit + unit);
    
                // Break the loop if scale is unchanged or perfect, or if we've just had enough.
            } while (scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations);
        }
    
        if (parts) {
            // Apply relative offset (+=/-=) if specified
            adjusted = parts[1] ? (+initialInUnit || +initial || 0) + (parts[1] + 1) * parts[2] : +parts[2];
    
            return adjusted;
        }
    };

    toolset$$implement({
        // CSS getter/setter for an element
        css: function(name, value) {var this$0 = this;
            var self = this,
                len = arguments.length,
                node = this[0],
                pseudoElement = value && value[0] === ":",
                style = node.style,
                computed;
    
            // Get CSS values
            if (pseudoElement || (len === 1 && (toolset$$is(name, "string") || toolset$$isArray(name)))) {
                var getValue = function(name)  {
                    var getter = util$csshooks$$default.get[name] || util$csshooks$$default._default(name, style),
                        // Try inline styles first.
                        value = pseudoElement ? value : toolset$$is(getter, "function") ? getter(style) : style[getter];
    
                    if (!value || pseudoElement) {
                        if (!computed) computed = toolset$$computeStyle(node, pseudoElement ? value : "");
    
                        value = toolset$$is(getter, "function") ? getter(computed) : computed[getter];
                    }
    
                    return value;
                };
    
                if (toolset$$is(name, "string")) {
                    return getValue(name);
                } else {
                    return toolset$$reduce(toolset$$map(name, getValue), function(memo, value, index)  {
                        memo[name[index]] = value;
                        return memo;
                    }, {});
                }
            }
    
            if (len === 2 && toolset$$is(name, "string")) {
                var ret, setter = util$csshooks$$default.set[name] || util$csshooks$$default._default(name, style);
    
                if (toolset$$is(value, "function")) {
                    value = value(this);
                }
    
                if (value == null) value = "";
    
                // Convert '+=' or '-=' to relative numbers
                if (value !== "" && (ret = RCSSNUM.exec(value)) && ret[1]) {
    
                    if (!computed) {
                        computed = toolset$$computeStyle(node);
                    }
    
                    value = util$adjustCSS$$adjustCSS(this, setter, ret, computed);
    
                    if (ret && ret[3]) {
                        value += ret[3];
                    }
                }
    
                if (toolset$$is(setter, "function")) {
                    setter(value, style);
                } else {
                    style[setter] = typeof value === "number" ? value + "px" : value + ""; // cast to string; 
                }
            } else if (len === 1 && name && toolset$$is(name, "object")) {
                toolset$$forOwn(name, function(key, value)  {
                    this$0.css(key, value);
                });
            } else {
                minErr$$minErr("css()", ERROR_MSG[4]);
            }
    
            return this;
        }
    }, null, function()  {return function(name) {
        if (arguments.length === 1 && toolset$$isArray(name)) {
            return {};
        }
        if (arguments.length !== 1 || !toolset$$is(name, "string")) {
            return this;
        }
    }});
    /* es6-transpiler has-iterators:false, has-generators: false */

    var // operator type / priority object
        modules$emmet$$operators = {"(": 1,")": 2,"^": 3,">": 4,"+": 5,"*": 6,"`": 7,"[": 8,".": 8,"#": 8},
        modules$emmet$$reParse = /`[^`]*`|\[[^\]]*\]|\.[^()>^+*`[#]+|[^()>^+*`[#.]+|\^+|./g,
        modules$emmet$$reAttr = /\s*([\w\-]+)(?:=((?:`([^`]*)`)|[^\s]*))?/g,
        modules$emmet$$reIndex = /(\$+)(?:@(-)?(\d+)?)?/g,
        modules$emmet$$reDot = /\./g,
        modules$emmet$$reDollar = /\$/g,
        modules$emmet$$tagCache = {"": ""},
        modules$emmet$$parseAttr = function(_, name, value, rawValue)  {
            // try to detemnie which kind of quotes to use
            var quote = value && value.indexOf("\"") >= 0 ? "'" : "\"";
    
            if (toolset$$is(rawValue, "string")) {
                // grab unquoted value for smart quotes
                value = rawValue;
            } else if (!toolset$$is(value, "string")) {
                // handle boolean attributes by using name as value
                value = name;
            }
            // always wrap attribute values with quotes even they don't exist
            return " " + name + "=" + quote + value + quote;
        },
        modules$emmet$$injection = function(term, adjusted)  {return function(html)  {
            // find index of where to inject the term
            var index = adjusted ? html.lastIndexOf("<") : html.indexOf(">");
            // inject the term into the HTML string
            return html.slice(0, index) + term + html.slice(index);
        }},
        modules$emmet$$processTag = function(tag)  {
            return modules$emmet$$tagCache[tag] || (modules$emmet$$tagCache[tag] = "<" + tag + "></" + tag + ">");
        },
       
       
        modules$emmet$$indexing = function(num, term)  {
           var stricted = num >= 1500 ? /* max 1500 HTML elements */ 1500 : (num <= 0 ? 1 : num),
               result = new Array(stricted),
              i = 0;
    
            for (;i < num; ++i) {
                result[i] = term.replace(modules$emmet$$reIndex, function(expr, fmt, sign, base)  {
                    var index = (sign ? num - i - 1 : i) + (base ? +base : 1);
                    // handle zero-padded index values, like $$$ etc.
                    return (fmt + index).slice(-fmt.length).replace(modules$emmet$$reDollar, "0");
                });
            }
            return result;  
        },
        modules$emmet$$badChars = /[&<>"']/g,
        // http://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
        modules$emmet$$charMap = {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"};

    // populate empty tag names with result
    "area base br col hr img input link meta param command keygen source".split(" ").forEach(function(tag)  {
        modules$emmet$$tagCache[tag] = "<" + tag + ">";
    });

    ugma.emmet = function(template, varMap) {var $D$7;var $D$8;var $D$9;
    
        if (!toolset$$is(template, "string")) minErr$$minErr("emmet()", ERROR_MSG[2]);
    
        if (varMap) template = ugma.format(template, varMap);
     // If already cached, return the cached result
        if (template in modules$emmet$$tagCache) {return modules$emmet$$tagCache[template];}
    
        // transform template string into RPN
    
        var stack = [], output = [];
    
    
        $D$9 = (template.match(modules$emmet$$reParse));$D$7 = 0;$D$8 = $D$9.length;for (var str ;$D$7 < $D$8;){str = ($D$9[$D$7++]);
            var op = str[0];
            var priority = modules$emmet$$operators[op];
    
            if (priority) {
                if (str !== "(") {
                    // for ^ operator need to skip > str.length times
                    for (var i = 0, n = (op === "^" ? str.length : 1); i < n; ++i) {
                        while (stack[0] !== op && modules$emmet$$operators[stack[0]] >= priority) {
                            var head = stack.shift();
    
                            output.push(head);
                            // for ^ operator stop shifting when the first > is found
                            if (op === "^" && head === ">") break;
                        }
                    }
                }
    
                if (str === ")") {
                    stack.shift(); // remove "(" symbol from stack
                } else {
                    // handle values inside of `...` and [...] sections
                    if (op === "[" || op === "`") {
                        output.push(str.slice(1, -1));
                    }
                    // handle multiple classes, e.g. a.one.two
                    if (op === ".") {
                        output.push(str.slice(1).replace(modules$emmet$$reDot, " "));
                    }
    
                    stack.unshift(op);
                }
            } else {
                output.push(str);
            }
        };$D$7 = $D$8 = $D$9 = void 0;
    
        output = output.concat(stack);
    
        // transform RPN into html nodes
    
        stack = [];
    
        $D$7 = 0;$D$8 = output.length;for (var str$1 ;$D$7 < $D$8;){str$1 = (output[$D$7++]);
            if (str$1 in modules$emmet$$operators) {
                var value = stack.shift();
                var node = stack.shift();
    
                if (typeof node === "string") {
                    node = [ modules$emmet$$processTag(node) ];
                }
    
               if (toolset$$is(node, "undefined") || toolset$$is(value, "undefined")) {
                   minErr$$minErr("emmet()", ERROR_MSG[4]);
               }
                        
                if(str$1 === ".") { // class
                    value = modules$emmet$$injection(" class=\"" + value + "\"");            
                } else if(str$1 === "#") { // id
                    value = modules$emmet$$injection(" id=\"" + value + "\"");
                } else if(str$1 === "[") { // id
                    value = modules$emmet$$injection(value.replace(modules$emmet$$reAttr, modules$emmet$$parseAttr));
                } else if(str$1 === "*") { // universal selector 
                    node = modules$emmet$$indexing(+value, node.join(""));
                } else if(str$1 === "`") { // Back tick
                    stack.unshift(node);
                    // escape unsafe HTML symbols
                    node = [ value.replace(modules$emmet$$badChars, function(ch)  {return modules$emmet$$charMap[ch]}) ];
                } else {  /* ">", "+", "^" */
                    value = toolset$$is(value, "string") ? modules$emmet$$processTag(value) : value.join("");
    
                    if (str$1 === ">") {
                        value = modules$emmet$$injection(value, true);
                    } else {
                        node.push(value);
                    }
                    }
    
                str$1 = toolset$$is(value, "function") ? node.map(value) : node;
            }
    
            stack.unshift(str$1);
        };$D$7 = $D$8 = void 0;
    
        if (output.length === 1) {
            // handle single tag case
            output = modules$emmet$$processTag(stack[0]);
        } else {
            output = stack[0].join("");
        }
    
        return output;
    };

    var modules$emmet$$default = modules$emmet$$tagCache;

    toolset$$implement({
         // Remove all children of the current node
        empty: function() {
            return this.set("");
        }
    }, null, function()  {return RETURN_THIS});

    // Globalize implement for use with plug-ins
    toolset$$implement({
        extend: function(mixins, Document) {
            if (Document) {
                // handle case when Document prototype is extended
                return toolset$$implement(mixins);
            }
            // handle case when Element protytype is extended
            return toolset$$implement(mixins, null, function()  {return RETURN_THIS});
        }
    });
    // Receive specific events at 60fps, with requestAnimationFrame (rAF).
    // http://www.html5rocks.com/en/tutorials/speed/animations/
    // NOTE! This feature only for browsers who support rAF, so no
    // polyfill needed except for iOS6. But are anyone using that browser?
    function util$eventhooks$$DebouncedWrapper(handler, node) {
        var debouncing;
        return function(e)  {
            if (!debouncing) {
                debouncing = true;
                node._["{{raf!trackira}}"] = ugma.requestFrame(function() {
                    handler(e);
                    debouncing = false;
                });
            }
        };
    }
    var util$eventhooks$$eventHooks = {};

    // Create mouseenter/leave events using mouseover/out and event-time checks
    // Support: Chrome 15+
    toolset$$forOwn({
        "mouseenter": "mouseover",
        "mouseleave": "mouseout"
    }, function(original, fixed) {
        util$eventhooks$$eventHooks[original] = function(handler) {
            // FIXME! It's working, but need to be re-factored
            handler._type = fixed;
            handler.capturing = false;
        };
    });

    // Support: IE10+
    // IE9 doesn't have native rAF, so skip frameevents for
    // that browser
    if (!INTERNET_EXPLORER || INTERNET_EXPLORER > 9) {
        // Special events for the frame events 'hook'
        toolset$$each(("resize touchmove mousewheel scroll mousemove drag").split(" "), function(name) {
            util$eventhooks$$eventHooks[name] = util$eventhooks$$DebouncedWrapper;
        });
    }

    /* istanbul ignore if */
    if ("onfocusin" in DOCUMENT.documentElement) {
        util$eventhooks$$eventHooks.focus = function(handler)  {
            handler._type = "focusin";
        };
        util$eventhooks$$eventHooks.blur = function(handler)  {
            handler._type = "focusout";
        };
    } else {
        // firefox doesn't support focusin/focusout events
        util$eventhooks$$eventHooks.focus = util$eventhooks$$eventHooks.blur = function(handler)  {
            handler.capturing = true;
        };
    }
    /* istanbul ignore else */
    if (DOCUMENT.createElement("input").validity) {
        util$eventhooks$$eventHooks.invalid = function(handler)  {
            handler.capturing = true;
        };
    }
    var util$eventhooks$$default = util$eventhooks$$eventHooks;

    function util$eventhandler$$getEventProperty(name, e, type, node, target, currentTarget) {
        if (toolset$$is(name, "number")) {
            var args = e["{{trackira}}"];
    
            return args ? args[name] : void 0;
        }
    
        switch (name) {
            case "type":
                return type;
            case "defaultPrevented":
                // Android 2.3 use returnValue instead of defaultPrevented
                return "defaultPrevented" in e ? e.defaultPrevented : e.returnValue === false;
            case "target":
                return Element(target);
            case "currentTarget":
                return Element(currentTarget);
            case "relatedTarget":
                return Element(e.relatedTarget);
        }
    
        var value = e[name];
    
        if (typeof value === "function") {
            return function()  {return value.apply(e, arguments)};
        }
    
        return value;
    }

    function util$eventhandler$$EventHandler(type, selector, callback, props, el, once) {
        var node = el[0],
            hook = util$eventhooks$$default[type],
            matcher = util$selectormatcher$$default(selector, node),
            handler = function(e)  {
                e = e || WINDOW.event;
                // early stop in case of default action
                if (util$eventhandler$$EventHandler.skip === type) return;
                var eventTarget = e.target || node.ownerDocument.documentElement;
                // Safari 6.0+ may fire events on text nodes (Node.TEXT_NODE is 3).
                // @see http://www.quirksmode.org/js/events_properties.html
                eventTarget = eventTarget.nodeType === 3 ? eventTarget.parentNode : eventTarget;
                // Test whether delegated events match the provided `selector` (filter),
                // if this is a event delegation, else use current DOM node as the `currentTarget`.
                var currentTarget = matcher &&
                    // Don't process clicks on disabled elements
                    (eventTarget.disabled !== true || e.type !== "click") ? matcher(eventTarget) : node,
                    args = props || [];
    
                // early stop for late binding or when target doesn't match selector
                if (!currentTarget) return;
    
                // off callback even if it throws an exception later
                if (once) el.off(type, callback);
    
                if (props) {
                    args = toolset$$map(args, function(name)  {return util$eventhandler$$getEventProperty(
                        name, e, type, node, eventTarget, currentTarget)});
                } else {
                    args = toolset$$slice.call(e["{{trackira}}"] || [0], 1);
                }
    
                // prevent default if handler returns false
                if (callback.apply(el, args) === false) {
                    e.preventDefault();
                }
            };
    
        if (hook) handler = hook(handler, el) || handler;
    
        handler.type = type;
        handler.callback = callback;
        handler.selector = selector;
    
        return handler;
    }

    var util$eventhandler$$default = util$eventhandler$$EventHandler;

    toolset$$implement({
            // Execute all handlers and behaviors attached to the 
            // matched elements for the given event type.
        fire: function(type) {
            var node = this[0],
                e, eventType, canContinue;
    
            if (toolset$$is(type, "string")) {
                var hook = util$eventhooks$$default[type],
                    handler = {};
    
                if (hook) handler = hook(handler) || handler;
    
                eventType = handler._type || type;
            } else {
                 minErr$$minErr("fire()", ERROR_MSG[1]);
            }
                e = node.ownerDocument.createEvent("HTMLEvents");
                e["{{trackira}}"] = arguments;
                e.initEvent(eventType, true, true);
                canContinue = node.dispatchEvent(e);
    
            // call native function to trigger default behavior
            if (canContinue && node[type]) {
                // prevent re-triggering of the current event
                util$eventhandler$$default.skip = type;
    
                toolset$$invoke(node, type);
    
                util$eventhandler$$default.skip = null;
            }
    
            return canContinue;
        }
    }, null, function()  {return RETURN_TRUE});

    // 'format' a placeholder value with it's original content 
    // @example
    // ugma.format('{0}-{1}', [0, 1]) equal to '0-1')
    var modules$format$$reVar = /\{([\w\-]+)\}/g;
    ugma.format = function(tmpl, varMap) {
        if (!toolset$$is(tmpl, "string")) tmpl = String(tmpl);
    
        if (!varMap || !toolset$$is(varMap, "object")) varMap = {};
    
        return tmpl.replace(modules$format$$reVar, function(x, name, index)  {
            if (name in varMap) {
                x = varMap[name];
    
                if (toolset$$is(x, "function")) x = x(index);
    
                x = String(x);
            }
    
            return x;
        });
    };

    var modules$frame$$global = WINDOW;
    // Test if we are within a foreign domain. Use raf from the top if possible.
    /* jshint ignore:start */
    try {
        // Accessing .name will throw SecurityError within a foreign domain.
        modules$frame$$global.top.name;
        modules$frame$$global = modules$frame$$global.top;
    } catch (e) {}
    /* jshint ignore:end */
    // Works around a iOS6 bug
    var modules$frame$$raf = modules$frame$$global.requestAnimationFrame,
        modules$frame$$craf = modules$frame$$global.cancelAnimationFrame,
        modules$frame$$lastTime = 0;

    if (!(modules$frame$$raf && !modules$frame$$craf)) {
        toolset$$each(VENDOR_PREFIXES, function(prefix)  {
            prefix = prefix.toLowerCase();
            modules$frame$$raf = modules$frame$$raf || WINDOW[prefix + "RequestAnimationFrame"];
            modules$frame$$craf = modules$frame$$craf || WINDOW[prefix + "CancelAnimationFrame"];
        });
    }

    // Executes a callback in the next frame
    ugma.requestFrame = function(callback)  {
        /* istanbul ignore else */
        if (modules$frame$$raf) {
            return modules$frame$$raf.call(modules$frame$$global, callback);
        } else {
            // Dynamically set delay on a per-tick basis to match 60fps.
            var currTime = Date.now(),
                timeDelay = Math.max(0, 16 - (currTime - modules$frame$$lastTime)); // 1000 / 60 = 16.666

            modules$frame$$lastTime = currTime + timeDelay;

            return modules$frame$$global.setTimeout(function()  {
                callback(currTime + timeDelay);
            }, timeDelay);
        }
    };

    // Works around a rare bug in Safari 6 where the first request is never invoked.
    ugma.requestFrame(function() {return function() {}});

    // Cancel a scheduled frame
    ugma.cancelFrame = function(frameId)  {
        /* istanbul ignore else */
        if (modules$frame$$craf) {
            modules$frame$$craf.call(modules$frame$$global, frameId);
        } else {
            modules$frame$$global.clearTimeout(frameId);
        }
    };

    var util$accessorhooks$$langFix = /_/g;

    var util$accessorhooks$$rfocusable = /^(?:input|select|textarea|button)$/i;

    var util$accessorhooks$$accessorHooks = {
    
        get: {
    
            style: function(node)  {return node.style.cssText},
            title: function(node)  {
                var doc = node.ownerDocument;
    
                return (node === doc.documentElement ? doc : node).title;
            },
            undefined: function(node)  {
                switch (node.tagName) {
                    case "SELECT":
                        return ~node.selectedIndex ? node.options[node.selectedIndex].value : "";
                    case "OPTION":
                        // Support: IE<11
                        // option.value not trimmed
                        return toolset$$trim(node.value);
                    default:
                        return node[node.type && "value" in node ? "value" : "innerHTML"];
                }
            },
            type: function(node)  {return node.getAttribute("type") || node.type}
        },
    
        set: {
            lang: function(node, value)  {
                // correct locale browser language before setting the attribute             
                // e.g. from zh_CN to zh-cn, from en_US to en-us
                node.setAttribute("lang", value.replace(util$accessorhooks$$langFix, "-").toLowerCase());
            },
    
            style: function(node, value)  {
                node.style.cssText = value;
            },
            title: function(node, value)  {
                var doc = node.ownerDocument;
    
                (node === doc.documentElement ? doc : node).title = value;
            },
            value: function(node, value) {
                if (node.tagName === "SELECT") {
                    // selectbox has special case
                    if (toolset$$every.call(node.options, function(o)  {return !(o.selected = o.value === value)})) {
                        node.selectedIndex = -1;
                    }
                } else {
                    // for IE use innerText for textareabecause it doesn't trigger onpropertychange
                    node.value = value;
                }
            }
        }
    };

    // properties written as camelCase
    toolset$$each(("tabIndex readOnly maxLength cellSpacing cellPadding rowSpan colSpan useMap dateTime " +
        "frameBorder contentEditable valueType defaultValue accessKey encType readOnly vAlign longDesc").split(" "), function(key) {
        // 'tabIndex' of <div> returns 0 by default on IE, yet other browsers
        // can return -1. So we give 'tabIndex' special treatment to fix that
        if (key === "tabIndex") {
            util$accessorhooks$$accessorHooks.get.tabindex = function(node)  {
                return node.hasAttribute("tabindex") ||
                    util$accessorhooks$$rfocusable.test(node.nodeName) || node.href ?
                    node.tabIndex :
                    -1;
            };
        } else {
            util$accessorhooks$$accessorHooks.get[key.toLowerCase()] = function(node)  {return node[key]};
        }
    });

    /*
        // Use a 'hook' for innerHTML because of Win8 apps
        accessorHooks.set.innerHTML = (node, value) => {
            // Win8 apps: Allow all html to be inserted
            if (typeof MSApp !== "undefined" && MSApp.execUnsafeLocalFunction) {
                MSApp.execUnsafeLocalFunction(function() {
                    node.innerHTML = value;
                });
            }
            node.innerHTML = value;
        };*/

    // fix hidden attribute for IE9
    if (INTERNET_EXPLORER === 9) {
        util$accessorhooks$$accessorHooks.set.hidden = function(node, value)  {
            node.hidden = value;
            node.setAttribute("hidden", "hidden");
            // trigger redraw in IE9
            node.style.zoom = "1";
        };
    }

    // Support: IE<=11+    
    (function() {
        var input = DOCUMENT.createElement("input");
    
        input.type = "checkbox";
        util$accessorhooks$$accessorHooks.get.checked = function(node)  {
            // Support: Android<4.4
            // Default value for a checkbox should be "on"
            if (input.value !== "") {
                if (node.type === "checkbox" ||
                    node.type === "radio") {
                    return node.getAttribute("value") === null ? "on" : node.value;
                }
            } else {
                return !!node.checked;
            }
        };
        // Support: IE<=11+
        // An input loses its value after becoming a radio
        input = DOCUMENT.createElement("input");
        input.value = "t";
        input.type = "radio";
    
        // Setting the type on a radio button after the value resets the value in IE9
        if (input.value !== "t") {
    
            util$accessorhooks$$accessorHooks.set.type = function(node, value) {
                if (value === "radio" &&
                    node.nodeName === "INPUT") {
                    var val = node.value;
                    node.setAttribute("type", value);
                    if (val) {
                        node.value = val;
                    }
                    return value;
                } else {
                    node.type = value;
                }
            };
        }
        input = null;
    }());
    var util$accessorhooks$$default = util$accessorhooks$$accessorHooks;

    var modules$get$$multiDash = /([A-Z])/g,
        modules$get$$dataAttr = function(node, key)  {
            // convert from camel case to dash-separated value
            key = "data-" + key.replace(modules$get$$multiDash, "-$1").toLowerCase();
    
            var value = node.getAttribute(key);
    
            if (value != null) {
                // try to recognize and parse object notation syntax
                if (value[0] === "{" && value[value.length - 1] === "}") {
                    try {
                        value = JSON.parse(value);
                    } catch (err) {}
                }
            }
            return value;
        };

    toolset$$implement({
        // Get property or attribute value by name
        get: function(name) {var this$0 = this;
            var node = this[0],
                hook = util$accessorhooks$$default.get[name];
            // use 'hook' if it exist
            if (hook) return hook(node, name);
    
            if (toolset$$is(name, "string")) {
                if (name in node) {
                    return node[name];
                    // if no private data storage   
                } else if (name[0] !== "_") {
                    return node.getAttribute(name);
                } else {
                    // remove '_' from the name
                    var key = name.slice(1),
                        data = this._;
                    // If no data was found internally, try to fetch any
                    // data from the HTML5 data-* attribute
                    if (!(key in data)) {
                        data[key] = modules$get$$dataAttr(node, key);
                    }
    
                    return data[key];
                }
            } else if (toolset$$isArray(name)) {
                return toolset$$reduce(name, function(memo, key)  {
                    return (memo[key] = this$0.get(key), memo);
                }, {});
            } else {
                minErr$$minErr("get()", ERROR_MSG[4]);
            }
        }
    }, null, function()  {return function() {}});

    toolset$$implement({
        // Inserts nodes after the last child of node, while replacing strings 
        // in nodes with native element or equivalent html string.
        append: ["beforeend", true, false, function(node, relatedNode)  {
            node.appendChild(relatedNode);
        }],
        // Inserts nodes before the first child of node, while replacing strings 
        // in nodes with native element or equivalent html strings.
        prepend: ["afterbegin", true, false, function(node, relatedNode)  {
            node.insertBefore(relatedNode, node.firstChild);
        }],
        // Insert nodes just before node while replacing strings in nodes with 
        // native element or a html string.
        before: ["beforebegin", true, true, function(node, relatedNode)  {
            node.parentNode.insertBefore(relatedNode, node);
        }],
        // Insert nodes just after node while replacing strings in nodes with 
        // native element or a html string .
        after: ["afterend", true, true, function(node, relatedNode)  {
            node.parentNode.insertBefore(relatedNode, node.nextSibling);
        }],
        // Replaces node with nodes, while replacing strings in nodes with 
        // native element or html string.
        replaceWith: ["", false, true, function(node, relatedNode)  {
            node.parentNode.replaceChild(relatedNode, node);
        }],
        remove: ["", false, true, function(node)  {
            node.parentNode.removeChild(node);
        }]
    }, function(methodName, adjacentHTML, native, requiresParent, strategy)  {return function() {var contents = SLICE$0.call(arguments, 0);var this$0 = this;
        var node = this[0];
    
        if (requiresParent && !node.parentNode) return this;
    
        if ((methodName === "after" || methodName === "before") && this === ugma) {
            minErr$$minErr(methodName + "()", "You can not  " + methodName + " an element non-existing HTML (documentElement)");
        }
        
        // don't create fragment for adjacentHTML
        var fragment = adjacentHTML ? "" : node.ownerDocument.createDocumentFragment();
    
        contents.forEach(function(content)  {
    
            // Handle native DOM elements - e.g. document.createElement('li')
            if (native && content.nodeType === 1) {
                content = Element(content);
            }
    
            if (toolset$$is(content, "function")) {
                content = content(this$0);
            }
    
            // merge a 'pure' array into a string
            if (toolset$$isArray(content) && !toolset$$is(content[0], "object")) {
                content = content.join();
            }
    
            if (toolset$$is(content, "string")) {
                if (toolset$$is(fragment, "string")) {
                    fragment += toolset$$trim(content);
                } else {
                    content = ugma.createAll(content);
                }
            } else if (content instanceof Element) {
                content = [content];
            }
            
            // handle documentFragments()
            if (content.nodeType === 11) {
                fragment = content;
            } else {
                if (toolset$$isArray(content)) {
                    if (toolset$$is(fragment, "string")) {
                        // append existing string to fragment
                        content = ugma.createAll(fragment).concat(content);
                        // fallback to document fragment strategy
                        fragment = node.ownerDocument.createDocumentFragment();
                    }
    
                    toolset$$each(content, function(el) {
                        fragment.appendChild(el instanceof Element ? el[0] : el);
                    });
                }
            }
        });
    
        if (toolset$$is(fragment, "string")) {
            node.insertAdjacentHTML(adjacentHTML, fragment);
        } else {
            strategy(node, fragment);
        }
    
        return this;
    }}, function()  {return RETURN_THIS});

    toolset$$implement({
        // Invokes a function for element if it's not empty and return array of results
        map: function(fn, context) {
            if (!toolset$$is(fn, "function")) {
                minErr$$minErr("map()", ERROR_MSG[4]);
            }
    
            return [fn.call(context, this)];
        }
    }, null, function()  {return function()  {return []}});

    var util$selectorhooks$$isHidden = function(node)  {
        var computed = toolset$$computeStyle(node);
    
        return computed.visibility === "hidden" || computed.display === "none";
    };

    var util$selectorhooks$$default = {
        ":focus": function(node)  {return node === node.ownerDocument.activeElement},
    
        ":visible": function(node)  {return !util$selectorhooks$$isHidden(node)},
    
        ":hidden": util$selectorhooks$$isHidden
    };

    toolset$$implement({
            // Check if the element matches selector
        matches: function(selector) {
            
             if (selector && toolset$$is(selector, "string")) {
                    // compare a match with CSS pseudos selectors 
                    // e.g "link.matches(":enabled") or "link.matches(":checked")
                    var checker = util$selectorhooks$$default[selector] ||
                        // native
                        util$selectormatcher$$default(selector);
                    return !!checker(this[0]);
                }
    
                // For objects, fallback to contains()
                if (toolset$$is(selector, "object")) {
                    return this.contains(selector);
                }
                // Throw
                minErr$$minErr("matches()", ERROR_MSG[1]);
        }
    }, null, function()  {return RETURN_FALSE});

    toolset$$implement({
        mock: function(content, varMap) {
            if (!content) return new Node();
    
            var result = this.create(content, varMap),
                mappings = this._["{{mutations!trackira}}"],
                applyExtensions = function(node)  {
                    toolset$$each(mappings, function(ext)  { ext(node, true) });
    
                    toolset$$each(node.children, applyExtensions);
                };
    
            applyExtensions(result[0]);
    
            return result;
        }
    });
    // Inspired by trick discovered by Daniel Buchner:
    // https://github.com/csuwldcat/SelectorListener
    var modules$mutate$$cssText;

    /* istanbul ignore if */
    if (INTERNET_EXPLORER < 10) {
        var modules$mutate$$legacyScripts = toolset$$filter.call(DOCUMENT.scripts, function(el)  {return el.src.indexOf("ugma.js") >= 0});
    
        if (modules$mutate$$legacyScripts.length < 1) {
               minErr$$minErr("mutate()", "Mutations will not work in IE 9 unless you include ugma.htc");
        }
    
        modules$mutate$$cssText = "-ms-behavior:url(" + modules$mutate$$legacyScripts[0].src.replace(".js", ".htc") + ") !important";
    } else {
        modules$mutate$$cssText = WEBKIT_PREFIX + "animation-name:{{ugma!trackira}} !important;";
        modules$mutate$$cssText += WEBKIT_PREFIX + "animation-duration:1ms !important";
    }

    toolset$$implement({
    
        mutate: function(selector, condition, definition) {var this$0 = this;
    
            // A mutation's first argument need to be a CSS selector (e.g. #foo, .bar, #foo:first-child)
            if (!toolset$$is(selector, "string")) {
                minErr$$minErr("mutate()", ERROR_MSG[7]);
            }
    
            if (selector[0] === "#") {
                minErr$$minErr("mutate()", "Mutations can't be invoked on id(#) tags");
            }
    
            if (arguments.length === 2) {
                definition = condition;
                condition = true;
            }
    
            if (toolset$$is(condition, "boolean")) condition = condition ? RETURN_TRUE : RETURN_FALSE;
            if (toolset$$is(definition, "function")) definition = {
                setup: definition
            };
    
            if (!definition || !toolset$$is(definition, "object") || !toolset$$is(condition, "function")) minErr$$minErr("mutate()", ERROR_MSG[4]);
    
            var node = this[0],
                mutations = this._["{{mutations!trackira}}"];
    
            if (!mutations) {
                this._["{{mutations!trackira}}"] = mutations = [];
    
                /* istanbul ignore if */
                if (INTERNET_EXPLORER < 10) {
                    node.attachEvent("ondataavailable", function()  {
                        var e = WINDOW.event;
    
                        if (e.srcUrn === "dataavailable") {
                            toolset$$each(mutations, function(ext)  {
                                ext(e.srcElement);
                            });
                        }
                    });
                } else {
                    // declare the fake animation on the first ugma.mutation method call
                    this.injectCSS("@" + WEBKIT_PREFIX + "keyframes {{ugma!trackira}}", "from {opacity:.99} to {opacity:1}");
                    // use capturing to suppress internal animationstart events
                    node.addEventListener(WEBKIT_PREFIX ? "webkitAnimationStart" : "animationstart", function(e)  {
                        if (e.animationName === "{{ugma!trackira}}") {
                            toolset$$each(mutations, function(ext)  {
                                ext(e.target);
                            });
                            // this is an internal event - stop it immediately
                            e.stopImmediatePropagation();
                        }
                    }, true);
                }
            }
    
            var ctr = definition.hasOwnProperty("setup") && definition.setup,
                index = mutations.length,
                matcher = util$selectormatcher$$default(selector),
                ext = function(node, mock)  {
                    var el = Element(node),
                        invoked = el._["{{invoked!trackira}}"];
    
                    if (!invoked) el._["{{invoked!trackira}}"] = invoked = [];
    
                    // skip previously invoked or mismatched elements
                    if (~invoked.indexOf(index) || !matcher(node)) return;
                    // mark extension as invoked
                    invoked.push(index);
    
                    if (mock === true || condition(el) !== false) {
                        // apply all private/public members to the element's interface
                        var filtered = toolset$$filter(definition, function(value, prop)  {
    
                            if (prop !== "setup") {
                                el[prop] = value;
    
                                return !mock && prop[0] === "_";
                            }
                        });
    
                        // invoke setup if it exists
                        if (ctr) toolset$$invoke(el, ctr);
                        // remove event handlers from element's interface
                        toolset$$each(filtered, function(prop)  {
                            delete el[prop];
                        });
                    }
                };
    
            mutations.push(ext);
             // mutations are always async - append CSS asynchronously
            WINDOW.setTimeout(function()  {
                toolset$$each(node.ownerDocument.querySelectorAll(selector), ext);
                this$0.injectCSS(selector, modules$mutate$$cssText);
            }, 0);
        }
    });

    // Create a ugma wrapper object for a native DOM element or a
    // jQuery element. E.g. (ugma.native($('#foo')[0]))
    ugma.native = function(node)  {
        var nodeType = node && node.nodeType;
        // filter non elements like text nodes, comments etc.
        return (((nodeType === 9 ? Document : Element))
            )
            (
                nodeType === 1 ||
                nodeType === 9 ?
                node :
                null
            );
    };

    toolset$$implement({
    
        // Remove an event handler, or all event listeners if no
        // arguments
    
        off: function(type, selector, callback) {
            if (typeof type !== "string") minErr$$minErr("off()", ERROR_MSG[7]);
    
            if (callback === void 0) {
                callback = selector;
                selector = void 0;
            }
    
            var self = this,
                node = this[0],
                removeHandler = function(handler)  {
    
                    // Cancel previous frame if it exists
                    if (self._["{{raf!trackira}}"]) {
                        ugma.cancelFrame(self._["{{raf!trackira}}"]);
                        // Zero out rAF id used during the animation
                        self._["{{raf!trackira}}"] = null;
                    }
                    // Remove the listener
                    node.removeEventListener((handler._type || handler.type), handler, !!handler.capturing);
                };
    
            this._["{{handler!trackira}}"] = toolset$$filter(this._["{{handler!trackira}}"], function(handler)  {
    
                if (type !== handler.type ||
                    selector && selector !== handler.selector ||
                    callback && callback !== handler.callback) {
                    return true;
                }
                removeHandler(handler);
            });
    
            return this;
        }
    }, null, function()  {return RETURN_THIS});

    toolset$$implement({
        // Calculates offset of the current element
        offset: function() {
            var node = this[0],
                docEl = node.ownerDocument.documentElement,
                clientTop = docEl.clientTop,
                clientLeft = docEl.clientLeft,
                scrollTop = WINDOW.pageYOffset || docEl.scrollTop,
                scrollLeft = WINDOW.pageXOffset || docEl.scrollLeft,
                boundingRect = node.getBoundingClientRect();
    
            // Make sure element is not hidden (display: none) or disconnected
            if (boundingRect.width ||
                boundingRect.height ||
                boundingRect.length) {
    
                return {
                    top: boundingRect.top + scrollTop - clientTop,
                    left: boundingRect.left + scrollLeft - clientLeft,
                    right: boundingRect.right + scrollLeft - clientLeft,
                    bottom: boundingRect.bottom + scrollTop - clientTop,
                    width: boundingRect.right - boundingRect.left,
                    height: boundingRect.bottom - boundingRect.top
                };
            }
        }
    }, null, function()  {return function() {
        return {
            top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }});

    toolset$$implement({
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function(other) {
            var node = this[0],
                offsetParent = node.offsetParent || HTML,
                isInline = this.css("display") === "inline";
            if (!isInline && offsetParent) {
                return Element(offsetParent);
            }
            while (offsetParent && Element(offsetParent).css("position") === "static") {
                offsetParent = offsetParent.offsetParent;
            }
    
            return Element(offsetParent);
        }
    }, null, function()  {return RETURN_FALSE});

    toolset$$implement({
        // Attach an event handler function for one or more events to 
        // the selected elements.
        on: false,
        // Attach a handler to an event for the elements. The handler
        // is executed at most once per element per event type.
        once: true
    
    }, function(method, single)  {return function(type, selector, args, callback) {
    
        var
            listeners = this._["{{handler!trackira}}"];
    
        if (!listeners) {
            this._["{{handler!trackira}}"] = listeners = [];
    
        }
    
    
        if (toolset$$is(type, "string")) {
            if (toolset$$is(args, "function")) {
                callback = args;
    
                if (toolset$$is(selector, "string")) {
                    args = null;
                } else {
                    args = selector;
                    selector = null;
                }
            }
    
            if (toolset$$is(selector, "function")) {
                callback = selector;
                selector = null;
                args = null;
            }
    
            if (!toolset$$is(callback, "function")) {
                  minErr$$minErr(method + "()", callback + " is not a function.");
            }
    
            var node = this[0],
                handler = util$eventhandler$$default(type, selector, callback, args, this, single);
            node.addEventListener(handler._type || type, handler, !!handler.capturing);
    
            // store event entry
            listeners.push(handler);
        } else if (toolset$$is(type, "object")) {
    
            var self = this;
    
            if (toolset$$isArray(type)) {
    
                toolset$$each(type, function(name) {
                    self[method](name, selector, args, callback);
                });
            } else {
                toolset$$forOwn(type, function(name, value) {
                    self[method](name, selector, args, value);
                });
            }
        } else {
            minErr$$minErr(method + "()", ERROR_MSG[7]);
        }
    
        return this;
    }}, function()  {return RETURN_THIS});var util$vendorPrefixed$$vendorPrefixed = (function()  {
        return toolset$$map(VENDOR_PREFIXES.concat(null), function(p) {
            return (p ? p.toLowerCase() + "M" : "m") + "atchesSelector";
        }).reduceRight(function(propName, p) {
            return propName || (HTML.matches && "matches" || p in HTML && p);
        }, null);
    });

    var util$selectorLookUp$$breaker = {},
         util$selectorLookUp$$contains = function(obj, target) {
           if (obj === null) {
               return false;
           }
   
           var result = false;
           toolset$$each(obj, function(value) {
               if (result || (result = value === target)) {
                   return util$selectorLookUp$$breaker;
               }
           });
           return result;
       };

    var util$selectorLookUp$$selectorLookUp = function(selector, context) {
    
            var results = [],
                matched;
    
            // Split selectors by comma if it's exists.
            if (selector.indexOf(",") !== -1 && (matched = selector.split(","))) {
                // Comma separated selectors. E.g $("p, a");
                // unique result, e.g "ul id=foo class=foo" should not appear two times.
                toolset$$each(matched, function(el) {
                    toolset$$each(util$selectorLookUp$$selectorLookUp(el), function(el) {
                        if (!util$selectorLookUp$$contains(results, el)) {
                            results.push(el);
                        }
                    });
                });
    
                return results;
            } else {
                var node, found = context.getElementsByTagName("*"),
                    i = 0,
                    l = found.length;
                // filter the nodes that were found using the matchesSelector
                for (; i < l; i++) {
                    node = found[i];
                    if (node.nodeType === 1 && node[util$vendorPrefixed$$vendorPrefixed](selector, context)) {
                        // keep the nodes that match the selector
                        results.push(node);
                    }
                }
                return results;
            }
        };


    var modules$query$$rquick = /^(?:(\w+)|\.([\w\-]+))$/,
        modules$query$$rescape = /'|\\/g,
        // Unique for each copy of ugma on the page
        modules$query$$buggyQSA = [],
        modules$query$$expando = "ugma_" + 1 * Date.now();

    // Check QSA implementation
    (function() {

        var div = DOCUMENT.createElement("div");

        // Detect querySelectorAll API implementations.
     HTML.appendChild( div ).innerHTML = "<a id='" + modules$query$$expando + "'></a>" +
        "<select id='" + modules$query$$expando + "-\f]' msallowcapture=''>" +
         "<option selected=''></option></select>";


        // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
        if (!div.querySelectorAll("[id~=" + modules$query$$expando + "-]").length) {
            modules$query$$buggyQSA.push("~=");
        }
 
        // Support: Safari 8+, iOS 8+
        // https://bugs.webkit.org/show_bug.cgi?id=136851
        // In-page `selector#id sibling-combinator selector` fails
        if (!div.querySelectorAll("a#" + modules$query$$expando + "+*").length) {
            modules$query$$buggyQSA.push(".#.+[+~]");
        }
        // Remove from its parent by default
        if (div.parentNode) {
            div.parentNode.removeChild(div);
        }
        // release memory in IE
        div = null;
    }());

    modules$query$$buggyQSA = modules$query$$buggyQSA.length && new RegExp(modules$query$$buggyQSA.join("|"));


    toolset$$implement({
            // Find the first matched element by css selector
            query: "",
            // Find all matched elements by css selector
            queryAll: "All"
    
    }, function(methodName, all)  {return function(selector) {
        if (!toolset$$is(selector, "string")) minErr$$minErr(methodName + "()",  ERROR_MSG[4]);
    
        var node = this[0],
            quickMatch = modules$query$$rquick.exec(selector),
            result, old, nid, context;
    
        if (quickMatch) {
            
            if (quickMatch[1]) {
                // speed-up: "TAG"
                result = node.getElementsByTagName(selector);
            } else {
                // speed-up: ".CLASS"
                result = node.getElementsByClassName(quickMatch[2]);
            }
    
            if (result && !all) result = result[0];
        } else {
            
         // Support: Chrome 30+, Android 4+, Safari 7+, PhandomJS 1.9.8+
          if ((!modules$query$$buggyQSA || !modules$query$$buggyQSA.test(selector))) { 
     
            old = true;
            context = node;
    
            if (node !== node.ownerDocument.documentElement) {
                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                if ( (old = node.getAttribute("id")) ) {
                    nid = old.replace(modules$query$$rescape, "\\$&");
                } else {
                    nid = "{{ugma!trackira}}";
                    node.setAttribute("id", nid);
                }
    
                nid = "[id='" + nid + "'] ";
                selector = nid + selector.split(",").join("," + nid);
            }
    
            result = toolset$$invoke(context, "querySelector" + all, selector);
    
            if (!old) node.removeAttribute("id");
           } else {
                            var js = util$selectorLookUp$$selectorLookUp(selector, node);
                            result = all ? js : js[0];
                        }
        }
    
        return all ? toolset$$map(result, Element) : Element(result);
    }}, function(methodName, all)  {return function()  {return all ? [] : new Node()}});

    toolset$$implement({
        // Set property/attribute value by name
        set: function(name, value) {var this$0 = this;
            var node = this[0];
    
            // handle the value shortcut
            if (arguments.length === 1) {
                if (toolset$$is(name, "function")) {
                    value = name;
                } else {
                    value = name == null ? "" : String(name);
                }
    
                if (value !== "[object Object]") {
                    var tag = node.tagName;
    
                    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "OPTION") {
                        name = "value";
                    } else {
                        name = "innerHTML";
                    }
                }
            }
    
            var hook = util$accessorhooks$$default.set[name],
                subscription = (this._["{{subscription!trackira}}"] || {})[name],
                oldValue;
    
            if (subscription) {
                oldValue = this.get(name);
            }
    
            if (toolset$$is(name, "string")) {
                if (name[0] === "_") {
                    this._[name.slice(1)] = value;
                } else {
                    if (toolset$$is(value, "function")) {
                        value = value(this);
                    }
    
                    if (hook) {
                        hook(node, value);
                    } else if (value == null) {
                        node.removeAttribute(name);
                    } else if (name in node) {
                        node[name] = value;
                    } else {
                        node.setAttribute(name, value);
                    }
                    /* istanbul ignore if */
                    if (GINGERBREAD) {
                        // always trigger reflow manually for Android Gingerbread
                        node.className = node.className;
                    }
                }
            } else if (toolset$$isArray(name)) {
                toolset$$each(name, function(key)  {
                    this$0.set(key, value);
                });
            } else if (toolset$$is(name, "object")) {
                toolset$$forOwn(name, function(key, value)  {
                    this$0.set(key, name[key]);
                });
            } else {
                minErr$$minErr("set()", ERROR_MSG[6]);
            }
    
            if (subscription && oldValue !== value) {
                toolset$$each(subscription, function(w)  {
                    toolset$$invoke(this$0, w, value, oldValue);
                });
            }
    
            return this;
        }
    }, null, function()  {return RETURN_THIS});
    var modules$shadow$$CONTEXT_TEMPLATE = "div[style=overflow:hidden]>object[data=`about:blank` type=text/html style=`position:absolute` width=100% height=100%]";
    /* istanbul ignore if */
    if (INTERNET_EXPLORER) {
        // use calc to cut ugly frame border in IE>8
        modules$shadow$$CONTEXT_TEMPLATE = modules$shadow$$CONTEXT_TEMPLATE.replace("position:absolute", "width:calc(100% + 4px);height:calc(100% + 4px);left:-2px;top:-2px;position:absolute");
    
            // for IE>8 have to set the data attribute AFTER adding element to the DOM
            modules$shadow$$CONTEXT_TEMPLATE = modules$shadow$$CONTEXT_TEMPLATE.replace("data=`about:blank` ", "");
    }
    // Chrome/Safari/Opera have serious bug with tabbing to the <object> tree:
    // https://code.google.com/p/chromium/issues/detail?id=255150

    toolset$$implement({
        shadow: function(name) {var callback = arguments[1];if(callback === void 0)callback = function()  {};
            var contexts = this._["{{context!trackira}}"] || (this._["{{context!trackira}}"] = {}),
                data = contexts[name] || [];
    
            if (data[0]) {
                // callback is always async
                WINDOW.setTimeout(function()  { callback(data[1]) }, 1);
    
                return data[0];
            }
            // use innerHTML instead of creating element manually because of IE8
            var ctx = ugma.create(modules$shadow$$CONTEXT_TEMPLATE);
            var object = ctx.get("firstChild");
            // set onload handler before adding element to the DOM
            object.onload = function()  {
                // apply user-defined styles for the context
                // need to add class in ready callback because of IE8
                if (ctx.addClass(name).css("position") === "static") {
                    ctx.css("position", "relative");
                }
                // store new context root internally and invoke callback
                callback(data[1] = new Document(object.contentDocument));
            };
    
            this.before(ctx);
            /* istanbul ignore if */
            if (INTERNET_EXPLORER) {
                // IE doesn't work if to set the data attribute before adding
                // the <object> element to the DOM. IE8 will ignore this change
                // and won't start builing a new document for about:blank
                object.data = "about:blank";
            }
            // store context data internally
            contexts[name] = data;
    
            return data[0] = ctx;
        }
    }, null, function()  {return function()  {return RETURN_FALSE}});

    toolset$$implement({
    // Subscribe on particular properties / attributes, and get notified if they are changing
        subscribe: function(name, callback) {
            var subscription = this._["{{subscription!trackira}}"];
    
            if (!subscription) this._["{{subscription!trackira}}"] = subscription = [];
    
             (subscription[name] || (subscription[name] = [])).push(callback);
    
            return this;
        },
    
        // Cancel / stop a property / attribute subscription
        unsubscribe: function(name, callback) {
            var subscription = this._["{{subscription!trackira}}"];
    
                if (subscription) {
                    subscription[name] = toolset$$filter((subscription[name] || []), function(cb)  {return cb !== callback});
                }
            return this;
        }
    }, null, function()  {return RETURN_THIS});

    toolset$$implement({
        // Find first element
        first: "firstElementChild",
        // Find last element
        last: "lastElementChild",
        // Find next following sibling element filtered by optional selector
        next: "nextElementSibling",
        // Find previous preceding sibling element filtered by optional selector
        prev: "previousElementSibling",
        // Find all following sibling elements filtered by optional selector
        nextAll: "nextElementSibling",
        // Find all preceding sibling elements filtered by optional selector
        prevAll: "previousElementSibling",
    }, function(methodName, propertyName)  {return function(selector) {
        if (selector && !toolset$$is(selector, "string")) minErr$$minErr(methodName + "()", ERROR_MSG[1]);
    
        var all = methodName.slice(-3) === "All",
            matcher = util$selectormatcher$$default(selector),
            descendants = all ? [] : null,
            currentNode = this[0];
    
        if (!matcher) currentNode = currentNode[propertyName];
    
        for (; currentNode; currentNode = currentNode[propertyName]) {
            if (currentNode.nodeType === 1 && (!matcher || matcher(currentNode))) {
                if (!all) break;
    
                descendants.push(currentNode);
            }
        }
    
        return all ? toolset$$map(descendants, Element) : Element(currentNode);
    }}, function(methodName)  {return function()  {return methodName.slice(-3) === "All" ? [] : new Node()}});

    toolset$$implement({
        // Get all preceding siblings of each element up to 
        // but not including the element matched by the CSS selector.
        prevUntil: "previousElementSibling",
        // Get all following siblings of each element up to 
        // but not including the element matched by the CSS selector.
        nextUntil: "nextElementSibling",
    }, function(methodName, propertyName)  {return function(selector, direction) {
    
        var currentNode = this[0],
            descendants = [],
            matcher = util$selectormatcher$$default(selector);
    
        if (!toolset$$is(selector, "string")) {
            // if no valid CSS selector, return either prevAll() or nextAll()
            return this[methodName.replace("Until", "All")]();
        }
    
        while ((currentNode = currentNode[direction])) {
            if (currentNode.nodeType === 1) {
                if (matcher(currentNode)) {
                    break;
                }
            }
            descendants.push(currentNode);
        }
    
        return toolset$$map(descendants, Element);
    
    }}, function()  {return function()  {return new Node()}});

    toolset$$implement({
        // Replace child nodes of current element
        value: function(val) {
            if (arguments.length === 0) {
                return this.get();
            }
            if (toolset$$is(val, "string")) {
                return this.set(val);
            }
            return this.set("").append(val);
        }
    }, null, function()  {return RETURN_THIS});

    var util$animationhandler$$TRANSITION_PROPS = toolset$$map(["timing-function", "property", "duration", "delay"], function(prop)  {return "transition-" + prop}),
        util$animationhandler$$parseTimeValue = function(value)  {
            var result = parseFloat(value) || 0;
            // if duration is in seconds, then multiple result value by 1000
            return !result || value.slice(-2) === "ms" ? result : result * 1000;
        },
        util$animationhandler$$calcTransitionDuration = function(transitionValues)  {
            var delays = transitionValues[3],
                durations = transitionValues[2];
    
            return Math.max.apply(Math, toolset$$map(durations, function(value, index)  {
                return util$animationhandler$$parseTimeValue(value) + (util$animationhandler$$parseTimeValue(delays[index]) || 0);
            }));
        };

    // initialize hooks for properties used below
    toolset$$each(util$animationhandler$$TRANSITION_PROPS.concat("animation-duration"), function(prop)  {
        util$csshooks$$default._default(prop, HTML.style);
    });

    var util$animationhandler$$default = function(node, computed, animationName, isHidden, done)  {
        var rules, duration;
    
        // IE9 is the last of the IE browsers to not support the 
        // transition property, or animations. As a result of this, we are returning a null
        // value so at least our show(), hide() and toggle() methods are working properly.
        /* istanbul ignore next */
        if (GINGERBREAD || INTERNET_EXPLORER < 10) return null;
    
        if (animationName) {
            duration = util$animationhandler$$parseTimeValue(computed[util$csshooks$$default.get["animation-duration"]]);
    
            if (!duration) return; // skip animations with zero duration
    
            rules = [
                WEBKIT_PREFIX + "animation-direction:" + (isHidden ? "normal" : "reverse"),
                WEBKIT_PREFIX + "animation-name:" + animationName,
                // for CSS3 animation element should always be visible
                "visibility:inherit"
            ];
        } else {
            var transitionValues = toolset$$map(util$animationhandler$$TRANSITION_PROPS, function(prop, index)  {
                // have to use regexp to split transition-timing-function value
                return computed[util$csshooks$$default.get[prop]].split(index ? ", " : /, (?!\d)/);
            });
    
            duration = util$animationhandler$$calcTransitionDuration(transitionValues);
    
            if (!duration) return; // skip transitions with zero duration
    
            if (transitionValues[1].indexOf("all") < 0) {
                // try to find existing or use 0s length or make a new visibility transition
                var visibilityIndex = transitionValues[1].indexOf("visibility");
    
                if (visibilityIndex < 0) visibilityIndex = transitionValues[2].indexOf("0s");
                if (visibilityIndex < 0) visibilityIndex = transitionValues[1].length;
    
                transitionValues[0][visibilityIndex] = "linear";
                transitionValues[1][visibilityIndex] = "visibility";
                transitionValues[isHidden ? 2 : 3][visibilityIndex] = "0s";
                transitionValues[isHidden ? 3 : 2][visibilityIndex] = duration + "ms";
            }
    
            rules = toolset$$map(transitionValues, function(props, index)  {
                // fill holes in a trasition property value
                var i = 0,
                    n = props.length;
                for (; i < n; ++i) {
                    props[i] = props[i] || props[i - 1] || "initial";
                }
    
                return WEBKIT_PREFIX + util$animationhandler$$TRANSITION_PROPS[index] + ":" + props.join(", ");
            });
    
            rules.push(
                // append target visibility value to trigger transition
                "visibility:" + (isHidden ? "hidden" : "inherit"),
                // use willChange to improve performance in modern browsers:
                // http://dev.opera.com/articles/css-will-change-property/
                "will-change:" + transitionValues[1].join(", ")
            );
        }
    
        return {
            cssText: rules.join(";"),
            initialCssText: node.style.cssText,
            // this function used to trigger callback
            handleEvent: function(e)  {
                if (e.target === node) {
                    if (animationName) {
                        if (e.animationName !== animationName) return;
                    } else {
                        if (e.propertyName !== "visibility") return;
                    }
    
                    e.stopPropagation(); // this is an internal event
    
                    done();
                }
            }
        };
    };

    var modules$visibility$$TRANSITION_EVENT_TYPE = WEBKIT_PREFIX ? "webkitTransitionEnd" : "transitionend",
        modules$visibility$$ANIMATION_EVENT_TYPE = WEBKIT_PREFIX ? "webkitAnimationEnd" : "animationend";

    toolset$$implement({
        // Show a single element
        show: false,
        // Hide a single element
        hide: true,
        // Toggles the CSS `display` of `element`
        toggle: null
    
    }, function(methodName, condition)  {return function(animationName, callback) {var this$0 = this;
    
        // Boolean toggle()
        if (methodName === "toggle" && toolset$$is(animationName, "boolean")) {
            condition = animationName;
            animationName = void 0;
        }
    
        if (!toolset$$is(animationName, "string")) {
            callback = animationName;
            animationName = null;
        }
    
        if (callback && !toolset$$is(callback, "function")) {
            minErr$$minErr(methodName + "()", ERROR_MSG[4]);
        }
    
        var node = this[0],
            style = node.style,
            computed = toolset$$computeStyle(node),
            isHidden = condition,
            frameId = this._["{{frame!trackira}}"],
            done = function()  {
                if (animationHandler) {
                    node.removeEventListener(eventType, animationHandler, true);
                    // clear inline style adjustments were made previously
                    style.cssText = animationHandler.initialCssText;
                } else {
                    this$0.set("aria-hidden", String(isHidden));
                }
                // always update element visibility property: use value "inherit"
                // to respect parent container visibility. Should be a separate
                // from setting cssText because of Opera 12 quirks
                style.visibility = isHidden ? "hidden" : "inherit";
    
                this$0._["{{frame!trackira}}"] = null;
    
                if (callback) callback(this$0);
            };
    
        if (!toolset$$is(isHidden, "boolean")) {
            // Can be either undefined or false.
            isHidden = node.getAttribute("aria-hidden") !== "true";
        }
    
        // cancel previous frame if it exists
        if (frameId) ugma.cancelFrame(frameId);
    
        if (!node.ownerDocument.documentElement.contains(node)) {
            // apply attribute/visibility syncronously for detached ugma elements
            // because browser returns zero animation/transition duration for them
            done();
        } else {
    
            var animationHandler = util$animationhandler$$default(node, computed, animationName, isHidden, done),
                eventType = animationName ? modules$visibility$$ANIMATION_EVENT_TYPE : modules$visibility$$TRANSITION_EVENT_TYPE;
                
            // Do rAF animation and save the frameID on the node itself
            this._["{{frame!trackira}}"] = ugma.requestFrame(!animationHandler ? done : function()  {
                node.addEventListener(eventType, animationHandler, true);
                // update modified style rules
                style.cssText = animationHandler.initialCssText + animationHandler.cssText;
                // trigger CSS3 transition / animation
                this$0.set("aria-hidden", String(isHidden));
            });
        }
    
        return this;
    }}, function()  {return RETURN_THIS});

    // Map over 'ugma' in case of overwrite
    var outro$$_ugma = WINDOW.ugma;

    // Runs ugma in *noConflict* mode, returning the original `ugma` namespace.
    ugma.noConflict = function() {
        if (WINDOW.ugma === ugma) {
            WINDOW.ugma = outro$$_ugma;
        }
    
        return ugma;
    };

    WINDOW.ugma = ugma;
})();
