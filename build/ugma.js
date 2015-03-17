/**
 * ugma javascript framework 0.0.1
 * https://github.com/ugma/ugma
 * 
 * Copyright 2014 - 2015 Kenny Flashlight
 * Released under the MIT license
 * 
 * Build date: Mon, 16 Mar 2015 12:18:58 GMT
 */
(function() {
    "use strict";var this$0 = this;

    function core$$Node() {}

    // Ugma are presented as a node tree similar to DOM Living specs
    function core$$Element(node) {
    
        if (this instanceof core$$Element) {
            node["__trackira__"] = this;
            this[0] = node;
            this._ = {};
    
        } else {
            return node ? node["__trackira__"] || new core$$Element(node) : new core$$Node();
        }
    }

    core$$Element.prototype = {
        // all of these placeholder strings will be replaced by gulps's
        version: "0.5.0a",
        codename: "trackira",
    
        toString: function() {
            var node = this[0];
            return node && node.tagName ? "<" + node.tagName.toLowerCase() + ">" : "";
        }
    };


    // Set correct document, and determine what kind it is.
    function core$$Document(node) {
        return core$$Element.call(this, node.documentElement);
    }

    // Prototype chain with Object.create() + assign constructor
    core$$Document.prototype = Object.create(core$$Element.prototype);
    core$$Document.prototype.constructor = core$$Document;
    core$$Node.prototype = Object.create(core$$Element.prototype);
    core$$Node.prototype.constructor = core$$Node;
    // both 'Document' and 'Node' need a overloaded toString 
    core$$Document.prototype.toString = function()  {return "<document>"};
    core$$Node.prototype.toString = function()  {return ""};

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

    var identityFunction = function(arg)  {return function()  {return arg}};
    var RETURN_THIS = function() {return this};
    var RETURN_TRUE = identityFunction(true);
    var RETURN_FALSE = identityFunction(false);

    var GINGERBREAD = /Android 2\.3\.[3-7]/i.test(WINDOW.navigator.userAgent);

    var VENDOR_PREFIXES = ["Webkit", "Moz", "ms", "O"];
    var WEBKIT_PREFIX = WINDOW.WebKitAnimationEvent ? "-webkit-" : "";

    // Create a ugma wrapper object for a native DOM element or a
    // jQuery element. E.g. (ugma.native($('#foo')[0]))
    ugma.native = function(node)  {
        var nodeType = node && node.nodeType;
        // filter non elements like text nodes, comments etc.
        return (((nodeType === 9 ? core$$Document : core$$Element))
            )
            (
                nodeType === 1 ||
                nodeType === 9 ?
                node :
                null
            );
    };

    // Set a new document, and define a local copy of ugma
    var ugma = new Document(DOCUMENT);

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