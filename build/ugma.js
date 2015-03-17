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
    "use strict";var SLICE$0 = Array.prototype.slice;
    var uclass$$extend = function (obj, extension, override) {
      var prop;
      if (override === false) {
        for (prop in extension)
          if (!(prop in obj))
            obj[prop] = extension[prop];
      } else {
        for (prop in extension)
          obj[prop] = extension[prop];
        if (extension.toString !== Object.prototype.toString)
          obj.toString = extension.toString;
      }
    };

    //============================================================================
    // @method my.extendClass
    // @params Class:function, extension:Object, ?override:boolean=true
    var uclass$$extendClass = function (Class, extension, override) {
      if (extension.STATIC) {
        uclass$$extend(Class, extension.STATIC, override);
        delete extension.STATIC;
      }
      uclass$$extend(Class.prototype, extension, override);
    };

    function uclass$$uClass () {
      var len = arguments.length;
        var body = arguments[len - 1];
        var SuperClass = len > 1 ? arguments[0] : null;
        var hasImplementClasses = len > 2;
        var Class, SuperClassEmpty;
    
        if (body.constructor === Object) {
          Class = function() {};
        } else {
          Class = body.constructor;
          delete body.constructor;
        }
    
        if (SuperClass) {
          SuperClassEmpty = function() {};
          SuperClassEmpty.prototype = SuperClass.prototype;
          Class.prototype = new SuperClassEmpty();
          Class.prototype.constructor = Class;
          Class.Super = SuperClass;
          uclass$$extend(Class, SuperClass, false);
        }
        
        
         if (hasImplementClasses)
          for (var i = 1; i < len - 1; i++)
            uclass$$extend(Class.prototype, arguments[i].prototype, false);    
    
        uclass$$extendClass(Class, body);
    
        return Class;
      }


    var core$$Node;

    var core$$Element = uclass$$uClass({
        constructor: function(node) {
            if (this instanceof core$$Element) {
            node["__trackira__"] = this;
            this[0] = node;
            this._ = {};
    
        } else {
            return node ? node["__trackira__"] || new core$$Element(node) : new core$$Node();
        }
       },
       // all of these placeholder strings will be replaced by gulps's
        version: "0.5.0a",
        codename: "trackira",
        toString: function() {
            var node = this[0];
            return node && node.tagName ? "<" + node.tagName.toLowerCase() + ">" : "";
        }
    });


    core$$Node = uclass$$uClass(core$$Element, {
        constructor: function() {
       },
       toString: function() { return ""; }
   
   });


    var core$$Document = uclass$$uClass(core$$Element, {
         constructor: function(node) {
         return core$$Element.call(this, node.documentElement);
        },
        toString: function() { return "<document>"; }
    
    });


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