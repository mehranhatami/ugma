/**
 * Javascript framework 0.0.1
 * https://github.com/ugma/ugma
 * 
 * Copyright 2014 - 2015 Kenny Flashlight
 * Released under the MIT license
 * 
 * Build date: Sat, 04 Apr 2015 02:25:27 GMT
 */
(function() {
    "use strict";
    function minErr$$minErr(module, msg) {
        // NOTE! The 'es6transpiller' will convert 'this' to '$this0' if we try to
        // use the arrow method here. And the function will fail BIG TIME !!
        var wrapper = function() {
            this.message = module ? ( msg ? msg : "This operation is not supported" ) +
                ( module.length > 4 ? " -> Module: " + module : " -> Core " ) : "The string did not match the expected pattern";
            // use the name on the framework
            this.name = "ugma";
        };
        wrapper.prototype = Object.create( Error.prototype );
        throw new wrapper( module, msg );
    }var WINDOW = window;
    var DOCUMENT = document;
    var HTML = DOCUMENT.documentElement;

    var RETURN_THIS = function() { return this };
    var RETURN_TRUE = function()  {return true};
    var RETURN_FALSE = function()  {return false};
    var FOCUSABLE = /^(?:input|select|textarea|button)$/i;

    var INTERNET_EXPLORER = document.documentMode;

    var VENDOR_PREFIXES = [ "Webkit", "Moz", "ms", "O" ];

    var RCSSNUM = /^(?:([+-])=|)([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))([a-z%]*)$/i;

    /** 
     * Check to see if we"re in IE9 to see if we are in combatibility mode and provide
     *  information on preventing it
     */
    if (DOCUMENT.documentMode && INTERNET_EXPLORER < 10) {
        WINDOW.console.warn("Internet Explorer is running in compatibility mode, please add the following " +
            "tag to your HTML to prevent this from happening: " +
            "<meta http-equiv='X-UA-Compatible' content='IE=edge' />"
        );
    }

    // jshint unused:false

    // Create local references to Array.prototype methods we'll want to use later.
    var helpers$$arrayProto = Array.prototype;

    var helpers$$every = helpers$$arrayProto.every;
    var helpers$$slice = helpers$$arrayProto.slice;
    var helpers$$isArray = Array.isArray;

    // Invokes the `callback` function once for each item in `arr` collection, which can only be an array.
    var helpers$$each = function(collection, callback)  {
                var arr = collection || [],
                    index = -1,
                    length = arr.length;
                while ( ++index < length ) {
                    if ( callback( arr[ index ], index, arr ) === false) {
                        break;
                    }
                }
            return arr;
        },
    
        // Create a new array with the results of calling a provided function 
        // on every element in this array.
        helpers$$map = function(collection, callback)  {
            var arr = collection || [],
                result = [];
            helpers$$each(arr, function( value, key )  {
                result.push( callback( value, key ) );
            });
            return result;
        },
    
        // is() returns a boolean for if typeof obj is exactly type.
        helpers$$is = function(obj, type)  {
            return typeof obj === type;
        },
    
        // Iterates over own enumerable properties of an object, executing  the callback for each property.
        helpers$$forOwn = function(object, callback)  {
    
                var obj = object || {},
                    key,
                    index = -1,
                    props = Object.keys( obj ),
                    length = props.length;
    
                while (++index < length) {
    
                    key = props[ index ];
    
                    if ( callback( key, obj[ key ], obj ) === false) {
                        break;
                    }
                }
            return obj;
        },
        // create a new array with all elements that pass the test implemented by the provided function.
        helpers$$filter = function( collection, predicate )  {
            var arr = collection || [],
                result = [];
    
            helpers$$forOwn( arr, function( index, value )  {
                if ( predicate( value, index, arr ) ) {
                    result.push( value );
                }
            });
            return result;
        },
    
        helpers$$trim = function( value )  {
            return helpers$$is( value, "string" ) ? value.trim() : value;
        },
    
        helpers$$inArray = function(arr, searchElement, fromIndex)  {
            fromIndex = fromIndex || 0;
            /* jshint ignore:start */
            if ( fromIndex > arr.length ) {
    
                arr - 1;
            }
            /* jshint ignore:end */
            var i = 0,
                len = arr.length;
    
            for ( ; i < len; i++ ) {
                if ( arr[ i ] === searchElement && fromIndex <= i ) {
                    return i;
                }
    
                if ( arr[ i ] === searchElement && fromIndex > i ) {
                    return -1;
                }
            }
            return -1;
        },
    
        helpers$$invoke = function(context, fn, arg1, arg2)  {
            if ( helpers$$is(fn, "string" ) ) fn = context[ fn ];
    
            try {
                return fn.call(context, arg1, arg2);
            } catch (err) {
                WINDOW.setTimeout( function()  { throw err }, 1 );
    
                return false;
            }
        },
        // internal method to extend ugma with methods - either 
        // the nodeTree or the domTree
        helpers$$implement = function(obj, callback, mixin)  {
    
            if (!callback) callback = function(method, strategy)  {return strategy};
    
            helpers$$forOwn(obj, function( method, func)  {
                var args = [ method] .concat( func );
                (mixin ? core$core$$nodeTree : core$core$$domTree).prototype[ method ] = callback.apply(null, args);
    
                if (mixin) core$core$$dummyTree.prototype[ method ] = mixin.apply(null, args);
            });
        },
    
        // Faster alternative then slice.call
        helpers$$sliceArgs = function(arg)  {
            var i = arg.length,
                args = new Array(i || 0);
    
            while (i--) {
                args[ i ] = arg[ i ];
            }
            return args;
        },
    
        helpers$$reDash = /([\:\-\_]+(.))/g,
        helpers$$mozHack = /^moz([A-Z])/,
    
        // Convert dashed to camelCase
        // Support: IE9-11+
        helpers$$camelize = function( prop )  {
            return prop && prop.replace(helpers$$reDash, function(_, separator, letter, offset)  {
                return offset ? letter.toUpperCase() : letter;
            }).replace (helpers$$mozHack, "Moz$1" );
        },
    
        // getComputedStyle takes a pseudoClass as an optional argument, so do we
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
        helpers$$computeStyle = function( node, pseudoElement )  {
            /* istanbul ignore if */
            pseudoElement = pseudoElement ? pseudoElement : "";
            // Support: IE<=11+, Firefox<=30+
            // IE throws on elements created in popups
            // FF meanwhile throws on frame elements through 'defaultView.getComputedStyle'
            if (node.ownerDocument.defaultView.opener) {
                return ( node.ownerDocument.defaultView ||
                    // This will work if the ownerDocument is a shadow DOM element
                    DOCUMENT.defaultView).getComputedStyle( node, pseudoElement );
            }
            return WINDOW.getComputedStyle(node, pseudoElement);
        },
    
        helpers$$injectElement = function(node)  {
            if ( node && node.nodeType === 1 ) return node.ownerDocument.head.appendChild( node );
        };

    var core$core$$nodeTree, core$core$$dummyTree, core$core$$domTree;

    function core$core$$uClass() {
        var len = arguments.length,
            body = arguments[ len - 1 ],
            SuperClass = len > 1 ? arguments[ 0 ] : null,
            Class, SuperClassEmpty,
    
            // helper for merging two object with each other
            extend = function(obj, extension, preserve)  {
    
                // failsave if something goes wrong
                if ( !obj || !extension ) return obj || extension || {};
    
                helpers$$forOwn( extension, function( prop, func )  {
                    // if preserve is set to true, obj will not be overwritten by extension if
                    // obj has already a method key
                    obj[ prop ] = (preserve === false && !( prop in obj ) ) ? func : func;
    
                    if ( preserve && extension.toString !== Object.prototype.toString ) {
                        obj.toString = extension.toString;
                    }
                });
            };
    
        if ( body.constructor === "[object Object]" ) {
            Class = function()  {};
        } else {
            Class = body.constructor;
            delete body.constructor;
        }
    
        if (SuperClass) {
            SuperClassEmpty = function()  {};
            SuperClassEmpty.prototype = SuperClass.prototype;
            Class.prototype = new SuperClassEmpty();
            Class.prototype.constructor = Class;
            Class.Super = SuperClass;
            extend( Class, SuperClass, false );
        }
    
        extend( Class.prototype, body );
    
        return Class;
    }

    core$core$$nodeTree = core$core$$uClass({
        constructor: function(node) {
    
                if ( this ) {
                    if ( node ) {
                        this[ 0 ] = node;
                        // use a generated property to store a reference
                        // to the wrapper for circular object binding
                        node._ugma = this;
    
                        this._ = {};
                    }
                } else {
                    // create a wrapper only once for each native element
                    return node ? node._ugma || new core$core$$nodeTree( node ) : new core$core$$dummyTree();
                }
            },
            toString: function() { return "<" + this[ 0 ].tagName + ">" },
    
            // Create a ugma wrapper object for a native DOM element or a
            // jQuery element. E.g. (ugma.native($('#foo')[0]))
            native: function(node) {
                var nodeType = node && node.nodeType;
                return ( nodeType === 9 ? core$core$$domTree : core$core$$nodeTree)(nodeType === 1 || nodeType === 9 ? node : null);
            }
    });

    core$core$$domTree = core$core$$uClass(core$core$$nodeTree, {
        constructor: function(node) { return core$core$$nodeTree.call( this, node.documentElement ) },
        toString: function() { return "#document" }
    });

    core$core$$dummyTree = core$core$$uClass(core$core$$nodeTree, {
        constructor: function() {},
        toString: function() { return "" }
    });

    // Set a new document, and define a local copy of ugma
    var core$core$$ugma = new core$core$$domTree( document );

    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches

    /* es6-transpiler has-iterators:false, has-generators: false */

    var util$selectormatcher$$quickMatch = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,
        util$selectormatcher$$matchesMethod = helpers$$map(VENDOR_PREFIXES.concat(null), function(p)  {
            return (p ? p.toLowerCase() + "M" : "m") + "atchesSelector";
        }).reduceRight(function(propName, p)  {
            return propName ||
                // Support: Chrome 34+, Gecko 34+, Safari 7.1, IE10+ (unprefixed)
                (HTML.matches && "matches" ||
                // Support: Chome <= 33, IE9, Opera 11.5+,  (prefixed)
                 p in HTML && p);
        }, null),
        util$selectormatcher$$query = function( node, selector )  {
    
            // match elem with all selected elems of parent
            var i = 0,
                elems = node.ownerDocument.querySelectorAll( selector ),
                len = elems.length;
    
            for (; i < len; i++) {
                // return true if match
                if ( elems[ i ] === node ) return true;
            }
            // otherwise return false
            return false;
        };

    var util$selectormatcher$$default = function(selector, context) {
    
        if (helpers$$is(selector, "string")) {
    
            var matches = util$selectormatcher$$quickMatch.exec(selector);
    
            if (matches) {
                if ( matches[ 1 ]) matches[ 1 ] = matches[ 1 ].toLowerCase();
                if ( matches[ 3 ]) matches[ 3 ] = matches[ 3 ].split("=");
                if ( matches[ 4 ]) matches[ 4 ] = " " + matches[ 4 ] + " ";
            }
    
            return function(node) {
                var result, found;
    
                for (; node && node.nodeType === 1; node = node.parentNode) {
                    if (matches) {
                        result = (
                            ( !matches[ 1 ] || node.nodeName.toLowerCase() === matches[ 1 ]) &&
                            ( !matches[ 2 ] || node.id === matches[ 2 ]) &&
                            ( !matches[ 3 ] || (matches[ 3 ][ 1 ] ? node.getAttribute(matches[ 3 ][ 0 ] ) === matches[ 3 ][ 1 ] : node.hasAttribute(matches[ 3 ][ 0 ]))) &&
                            ( !matches[ 4 ] || (" " + node.className + " ").indexOf(matches[ 4 ]) >= 0 )
                        );
                    } else {
                        result = util$selectormatcher$$matchesMethod ? node[util$selectormatcher$$matchesMethod](selector) : util$selectormatcher$$query(node, selector);
                    }
    
                    if (result || !context || node === context) break;
                }
    
                return result && node;
            };
        }
        return null;
    };

    helpers$$implement({
        /**
         * Returns the first child node in a collection of children filtered by index
         * @param  {Number} index
         * @function
         */
        child: false,
        /**
         * eturns all child nodes in a collection of children filtered by optional selector
         * @param  {String} [selector] css selector
         * @function
         */
        children: true
    
    }, function( methodName, all )  {return function( selector ) {
        if (selector && (!helpers$$is(selector, all ? "string" : "number" ) ) ) {
            minErr$$minErr(methodName + "()", selector + " is not a " + ( all ? " string" : " number" ) + " value" );
        }
    
        var node = this[ 0 ],
            matcher = util$selectormatcher$$default( selector ),
            children = node.children;
    
        if ( all ) {
            if ( matcher ) children = helpers$$filter( children, matcher );
    
            return helpers$$map(children, core$core$$nodeTree);
        } else {
            if ( selector < 0 ) selector = children.length + selector;
    
            return core$core$$nodeTree( children[ selector ] );
        }
    }}, function( methodName, all )  {return function()  {return all ? [] : new core$core$$dummyTree()}} );

    /* es6-transpiler has-iterators:false, has-generators: false */
    var modules$classes$$reClass = /[\n\t\r]/g,
        modules$classes$$whitespace = /\s/g,
        modules$classes$$hasClassList = !!DOCUMENT.createElement("div").classList;

    helpers$$implement({
       
       /**
        * Adds a class(es) or an array of class names
        * @param  {...String} classNames class name(s)
        * @function
        */    
        addClass: [RETURN_THIS, "add", function( node, token )  {
            var existingClasses = (" " + node[ 0 ].className + " ")
                .replace(modules$classes$$reClass, " ");
    
            if (existingClasses.indexOf(" " + token + " ") === -1) {
                existingClasses += helpers$$trim(token) + " ";
            }
    
            node[ 0 ].className = helpers$$trim(existingClasses);
        }],
       /**
        * Remove class(es) or an array of class names from element
        * @param  {...String} classNames class name(s)
        * @function
        */    
        removeClass: [RETURN_THIS, "remove", function( node, token )  {
            node[ 0 ].className = helpers$$trim((" " + node[ 0 ].className + " ")
                .replace(modules$classes$$reClass, " ")
                .replace(" " + helpers$$trim(token) + " ", " "));
        }],
       /**
        * Check if element contains class name
        * @param  {...String} classNames class name(s)
        * @function
        */    
        hasClass: [RETURN_FALSE, "contains", false, function( node, token )  {
            return ((" " + node[ 0 ].className + " ")
                .replace(modules$classes$$reClass, " ").indexOf(" " + token + " ") > -1);
        }],
       /**
        * Toggle the `class` in the class list. Optionally force state via `condition`
        * @param  {...String} classNames class name(s)
        * @function
        */    
        toggleClass: [RETURN_FALSE, "toggle", function( el, token )  {
            var hasClass = el.hasClass(token);
    
            if (hasClass) {
                el.removeClass(token);
            } else {
                el[ 0 ].className += " " + token;
            }
    
            return !hasClass;
        }]
    }, function(methodName, defaultStrategy, nativeMethodName, strategy)  {
    
        /* istanbul ignore else  */
        if (modules$classes$$hasClassList) {
            // use native classList property if possible
            strategy = function(el, token) {
                return el[0].classList[nativeMethodName](token);
            };
        }
    
        if (defaultStrategy === RETURN_FALSE) {
    
            return function(token, force) {
               
                if (typeof force === "boolean" && nativeMethodName === "toggle") {
                    this[force ? "addClass" : "removeClass"](token);
    
                    return force;
                }
    
                if (!helpers$$is(token, "string")) minErr$$minErr(nativeMethodName + "()", "The class provided is not a string.");
    
                return strategy(this, helpers$$trim(token));
            };
        } else {
    
            return function() {
                    var i = 0,
                        len = arguments.length;
                    for (; i < len; i++) {    
                    
                    if (!helpers$$is(arguments[ i ], "string")) minErr$$minErr(nativeMethodName + "()", "The class provided is not a string.");
    
                    strategy(this, arguments[ i ]);
                }
    
                return this;
            };
        }
    }, function(methodName, defaultStrategy)  {return defaultStrategy});

    helpers$$implement({
      /**
       * Clear a property/attribute on the node
       * @param  {String}   name    property/attribute name
       */
        clear: function(name) {
            this[ 0 ].removeAttribute( name );
            return this;
        }
    
    }, null, function()  {return RETURN_THIS});

    // Reference: https://dom.spec.whatwg.org/#dom-node-clonenode

    helpers$$implement({
      /**
       * Returns a copy of a DOM node.
       * @param {Boolean} [deep=true] true if all descendants should also be cloned, or false otherwise
       */
        clone: function(deep) {
            
            if (!helpers$$is(deep, "boolean")) minErr$$minErr("clone()", "This element can not be cloned.");
            
            return new core$core$$nodeTree( this[ 0 ].cloneNode(deep) );
        }
    }, null, function()  {return function()  {return new core$core$$dummyTree()}});

    // Reference: https://dom.spec.whatwg.org/#dom-element-closest 

    helpers$$implement({
     /**
      * Find parent element filtered by optional selector 
      * @param {String} [selector] css selector
      * @Following the Element#closest specs  
      * @function
      */
        closest: function(selector) {
            if ( selector && !helpers$$is( selector, "string" ) ) minErr$$minErr( "closest()", "The string did not match the expected pattern" );
    
            var matches = util$selectormatcher$$default( selector ),
                parentNode = this[ 0 ];
            
            // document has no .matches
            if ( !matches ) {
                parentNode = parentNode.parentElement;
            }
    
            for (; parentNode; parentNode = parentNode.parentElement ) {
                if (parentNode.nodeType === 1 && ( !matches || matches( parentNode ) ) ) {
                    break;
                }
            }
    
            return core$core$$nodeTree( parentNode );
        }
    }, null, function()  {return function()  {return new core$core$$dummyTree()}} );

    helpers$$implement({
     /**
      * Check if element is inside of context
      * @param  {ugma wrapped Object} element to check
      * @return {Boolean} returns true if success and false otherwise
      *
      * Note! 
      *
      * The contains(other) method returns true if other is an inclusive descendant of the 
      * context object, and false otherwise (including when other is null).
      *
      * @reference: https://dom.spec.whatwg.org/#dom-node-comparedocumentposition 
      */
        contains: function(element) {
            var reference = this[ 0 ];
    
            if ( element instanceof core$core$$nodeTree ) {
                var otherNode = element[ 0 ];
    
                // If other and reference are the same object, return zero.
                if ( reference === otherNode ) {
                    return 0;
                }
                return !!( element instanceof core$core$$nodeTree &&
                    ( reference === otherNode || reference.compareDocumentPosition( otherNode ) & 16 ) );
            }
    
            minErr$$minErr( "contains()", "Comparing position against non-Node values is not allowed." );
        }
    }, null, function()  {return RETURN_FALSE});

    var util$csshooks$$UnitlessNumber = ("box-flex box-flex-group column-count flex flex-grow flex-shrink order orphans " +
        "color richness volume counter-increment float reflect stop-opacity float scale backface-visibility " +
        "fill-opacity font-weight line-height opacity orphans widows z-index zoom column-rule-color perspective alpha " +
        "overflow rotate3d border-right-color border-top-color text-decoration-color text-emphasis-color " +
        // SVG-related properties
        "stop-opacity stroke-mitrelimit stroke-dash-offset, stroke-width, stroke-opacity fill-opacity").split(" "),
        
        util$csshooks$$cssHooks = { get: {}, set: {} },
        util$csshooks$$directions = ["Top", "Right", "Bottom", "Left"],
        util$csshooks$$shortHand = {
            font:           ["fontStyle", "fontSize", "/", "lineHeight", "fontFamily"],
            borderRadius:   ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
            padding:        helpers$$map( util$csshooks$$directions, function( dir )  {return "padding" + dir} ),
            margin:         helpers$$map( util$csshooks$$directions, function( dir )  {return "margin" + dir} ),
            "border-width": helpers$$map( util$csshooks$$directions, function( dir )  {return "border" + dir + "Width"} ),
            "border-style": helpers$$map( util$csshooks$$directions, function( dir )  {return "border" + dir + "Style"} )
        };

    // Don't automatically add 'px' to these possibly-unitless properties
    helpers$$each(util$csshooks$$UnitlessNumber, function( propName )  {
        var stylePropName = helpers$$camelize(propName);
    
        util$csshooks$$cssHooks.get[ propName ] = stylePropName;
        util$csshooks$$cssHooks.set[ propName ] = function( value, style )  {
            style[stylePropName] = value + "";
        };
    });

    // normalize property shortcuts
    helpers$$forOwn(util$csshooks$$shortHand, function(key, props)  {
    
        util$csshooks$$cssHooks.get[ key ] = function(style)  {
            var result = [],
                hasEmptyStyleValue = function(prop, index)  {
                    result.push(prop === "/" ? prop : style[ prop ]);
    
                    return !result[index];
                };
    
            return props.some(hasEmptyStyleValue) ? "" : result.join(" ");
        };
    
        util$csshooks$$cssHooks.set[ key ] = function(value, style)  {
            if (value && "cssText" in style) {
                // normalize setting complex property across browsers
                style.cssText += ";" + key + ":" + value;
            } else {
                helpers$$each( props, function(name)  {return style[ name ] = typeof value === "number" ? value + "px" : value + ""} );
            }
        };
    });

    util$csshooks$$cssHooks._default = function(name, style) {
        var propName = helpers$$camelize( name );
    
        if (!(propName in style)) {
            propName = helpers$$filter( helpers$$map(VENDOR_PREFIXES, function( prefix )  {return prefix + propName[ 0 ].toUpperCase() + propName.slice( 1 )}), function( prop )  {return prop in style})[ 0 ];
        }
    
        return this.get[ name ] = this.set[ name ] = propName;
    };

    var util$csshooks$$default = util$csshooks$$cssHooks;
    function util$adjustCSS$$adjustCSS(root, prop, parts, computed) {
    
        var adjusted,
            scale = 1,
            maxIterations = 20,
            currentValue = function() {
                return parseFloat( computed[ prop ] );
            },
            initial = currentValue(),
            unit = parts && parts[ 3 ] || "",
            // Starting value computation is required for potential unit mismatches
            initialInUnit = (unit !== "px" && +initial) && RCSSNUM.exec( computed[ prop ] );
    
        if (initialInUnit && initialInUnit[ 3 ] !== unit) {
    
            unit = unit || initialInUnit[ 3 ];
    
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
            adjusted = parts[ 1 ] ? (+initialInUnit || +initial || 0) + ( parts[ 1 ] + 1 ) * parts[ 2 ] : +parts[ 2 ];
    
            return adjusted;
        }
    }

    helpers$$implement({
      /**
        * Get the value of a style property for the DOM Node, or set one or more style properties for a DOM Node.
        * @param  {String|Object}      name    style property name or key/value object
        * @param  {String|Function}    [value] style property value or functor
        */   
        css: function(name, value) {var this$0 = this;
            
            var len = arguments.length,
                node = this[ 0 ],
                pseudoElement = value && value[ 0 ] === ":",
                style = node.style,
                computed;
   
            // Get CSS values
            // with support for pseudo-elements in getComputedStyle 
            if ( pseudoElement || ( len === 1 && ( helpers$$is( name, "string" ) || helpers$$isArray( name ) ) ) ) {
                var getValue = function( name )  {
                    var getter = util$csshooks$$default.get[ name ] || util$csshooks$$default._default( name, style ),
   
                        // if a 'pseudoElement' is present, don't change the original value. 
                        // The 'pseudoElement' need to be the second argument.
                        // E.g. link.css('color', ':before');
                        value = pseudoElement ? value : helpers$$is( getter, "function" ) ? getter( style ) : style[ getter ];
   
                    if ( !value || pseudoElement ) {
                        if ( !computed ) computed = helpers$$computeStyle(node, pseudoElement ? value : "" );
   
                        value = helpers$$is( getter, "function" ) ? getter( computed ) : computed[ getter ];
                    }
   
                    return value;
                };
   
                if ( helpers$$is( name, "string" ) ) {
   
                    return getValue(name);
   
                } else {
                    var obj = {};
                     helpers$$each( helpers$$map( name, getValue ), function( value, index )  {
                        obj[ name [ index ] ] = value;
                    } );
                  return obj;
                }
            }
   
            if ( len === 2 && helpers$$is( name, "string" ) ) {
                var ret, setter = util$csshooks$$default.set[ name ] || util$csshooks$$default._default( name, style );
   
                if ( helpers$$is( value, "function" ) ) value = value( this );
   
                if ( value == null || helpers$$is( value, "boolean" ) ) value = "";
   
                // Convert '+=' or '-=' to relative numbers
                if ( value !== "" && ( ret = RCSSNUM.exec( value ) ) && ret[ 1 ] ) {
   
                    if (!computed) computed = helpers$$computeStyle(node);
   
                    value = util$adjustCSS$$adjustCSS( this, setter, ret, computed );
   
                    if ( ret && ret[ 3 ] ) value += ret[ 3 ];
                }
   
                if ( helpers$$is( setter, "function" ) ) {
                    setter ( value, style );
                } else {
                    // prevent dangerous style values
                    style[ setter ] = helpers$$is( value, "number" ) ? value + "px" : ( helpers$$is( value, "string" )  ? helpers$$trim( value ) : "" + value ); // cast to string 
                }
            } else if ( len === 1 && name && helpers$$is( name, "object" ) ) {
                
                helpers$$forOwn( name, function( key, value )  {
                    this$0.css( key, value );
                });
                
            } else {
                minErr$$minErr( "css()", "This operation is not supported" );
            }
   
            return this;
        }
    }, null, function()  {return function( name ) {
   
        if ( arguments.length === 1 && helpers$$isArray( name ) ) return {};
   
        if ( arguments.length !== 1 || !helpers$$is( name, "string" ) ) return this;
    }});

    var util$readData$$multiDash = /([A-Z])/g,
        // Read the specified attribute from the equivalent HTML5 `data-*` attribute,
        util$readData$$readData = function( node, key )  {
    
        // convert from camel case to dash-separated value
    
        key = key.replace( util$readData$$multiDash, "-$&" ).toLowerCase();
    
        var value = node.getAttribute( key );
    
        if ( value != null ) {
    
            // try to recognize and parse object notation syntax
            if ( value[ 0 ] === "{" && value[ value.length - 1 ] === "}" ) {
                try {
                    value = JSON.parse( value );
                } catch ( err ) {}
            }
        }
    
        return value;
    };

    helpers$$implement({
      /**
       * Getter/setter of a data entry value. Tries to read the appropriate
       * HTML5 data-* attribute if it exists
       * @param  {String|Object|Array}  key(s)  data key or key/value object or array of keys
       * @param  {Object}               [value] data value to store
       * @return {Object} data entry value or this in case of setter
       */
        data: function(key, value) {var this$0 = this;
            
            var len = arguments.length;
            
            if ( len === 1 ) {
                if ( helpers$$is( key, "string" ) ) {
    
                    var data = this._;
                    // If no data was found internally, try to fetch any
                    // data from the HTML5 data-* attribute
                    if ( !( key in data ) ) data[ key ] = util$readData$$readData( this[ 0 ], "data-" + key );
    
                    return data[ key ];
                    
                // Set the value (with attr map support)
                } else if ( key && helpers$$is( key, "object" ) ) {
                 
                    if ( helpers$$isArray( key ) ) {
                        return this.data( helpers$$map(key, function( key )  {return key} ) );
                    } else {
                        return helpers$$forOwn( key, function( key, value )  {
                            this$0.data( key, value );
                        });
                    }
                }
            } else if ( len === 2 ) {
                // delete the private property if the value is 'null' or 'undefined'
                if ( value === null || value === undefined ) {
                    delete this._[ key ];
                } else {
                    this._[ key ] = value;
                }
            }
            return this;
        }
    }, null, function()  {return RETURN_THIS} );

    helpers$$implement({
      /**
        * Remove child nodes of current element from the DOM
        * @function
        */
        empty: function() { return this.set( "" ) }
    }, null, function()  {return RETURN_THIS});

    var util$raf$$lastTime = 0,
        util$raf$$requestAnimationFrame =
              WINDOW.requestAnimationFrame             ||
              WINDOW.webkitRequestAnimationFrame       ||
              WINDOW.mozRequestAnimationFrame,
        util$raf$$cancelAnimationFrame = 
              WINDOW.cancelAnimationFrame              ||
              WINDOW.webkitCancelAnimationFrame        ||
              WINDOW.webkitCancelRequestAnimationFrame ||
              WINDOW.mozCancelAnimationFrame,
        util$raf$$requestFrame = util$raf$$requestAnimationFrame ||
          function( callback ) {
            // Dynamically set delay on a per-tick basis to match 60fps.
            var currTime = Date.now(),
                timeDelay = Math.max( 0, 16 - ( currTime - util$raf$$lastTime ) ); // 1000 / 60 = 16.666
            util$raf$$lastTime = currTime + timeDelay;
            return WINDOW.setTimeout( function() {
                callback( Date.now() );
            }, timeDelay );
        },
        util$raf$$cancelFrame = util$raf$$cancelAnimationFrame || 
          function( frameId ) {
            WINDOW.clearTimeout( frameId );
        };

    // Works around a rare bug in Safari 6 where the first request is never invoked.
    util$raf$$requestFrame( function()  {return function()  {}} );

    function util$DebouncedWrapper$$DebouncedWrapper( handler, node ) {
        var debouncing;
        return function( e )  {
            if ( !debouncing ) {
                debouncing = true;
                node._._raf = util$raf$$requestFrame( function()  {
                    handler( e );
                    debouncing = false;
                });
            }
        };
    }

    var util$eventhooks$$eventHooks = {};

    // Special events for the frame events 'hook'
    helpers$$each(("touchmove mousewheel scroll mousemove drag").split(" "), function( name )  {
        util$eventhooks$$eventHooks[ name ] = util$DebouncedWrapper$$DebouncedWrapper;
    });

    // Support: Firefox, Chrome, Safari
    // Create 'bubbling' focus and blur events

    if ("onfocusin" in DOCUMENT.documentElement) {
        util$eventhooks$$eventHooks.focus = function( handler )  { handler._eventType = "focusin" };
        util$eventhooks$$eventHooks.blur = function( handler )  { handler._eventType = "focusout" };
    } else {
        // firefox doesn't support focusin/focusout events
        util$eventhooks$$eventHooks.focus = util$eventhooks$$eventHooks.blur = function( handler )  { handler.capturing = true };
    }
    /* istanbul ignore else */
    if (DOCUMENT.createElement( "input" ).validity) {
        util$eventhooks$$eventHooks.invalid = function( handler )  {
            handler.capturing = true;
        };
    }
    // Support: IE9
    if (INTERNET_EXPLORER < 10) {
    
        var util$eventhooks$$capturedNode, util$eventhooks$$capturedNodeValue;
    
        // IE9 doesn't fire oninput when text is deleted, so use
        // onselectionchange event to detect such cases
        // http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
        DOCUMENT.attachEvent("onselectionchange", function()  {
            if (util$eventhooks$$capturedNode && util$eventhooks$$capturedNode.value !== util$eventhooks$$capturedNodeValue) {
                util$eventhooks$$capturedNodeValue = util$eventhooks$$capturedNode.value;
                // trigger custom event that capture
                core$core$$ugma.native( util$eventhooks$$capturedNode ).trigger( "input" );
            }
        });
    
        // input event fix via propertychange
        DOCUMENT.attachEvent("onfocusin", function()  {
            util$eventhooks$$capturedNode = WINDOW.event.srcElement;
            util$eventhooks$$capturedNodeValue = util$eventhooks$$capturedNode.value;
        });
    }

    var util$eventhooks$$default = util$eventhooks$$eventHooks;

    function util$eventhandler$$getEventProperty(name, e, eventType, node, target, currentTarget) {
    
        if ( helpers$$is( name, "number" ) ) {
    
            var args = e._trigger;
    
            return args ? args[ name ] : void 0;
        }
    
        if ( name === "type" )               return eventType;
        if ( name === "defaultPrevented" )   return e.defaultPrevented;
        if ( name === "target" )             return core$core$$nodeTree( target );
        if ( name === "currentTarget" )      return core$core$$nodeTree( currentTarget );
        if ( name === "relatedTarget" )      return core$core$$nodeTree( e.relatedTarget );
    
        var value = e[ name ];
    
        if ( helpers$$is( value, "function" ) ) return function()  {return value.apply( e, arguments )};
    
        return value;
    }

    function util$eventhandler$$EventHandler( el, eventType, selector, callback, props, once, namespace ) {
        var node = el[ 0 ],
            hook = util$eventhooks$$default[ eventType ],
            matcher = util$selectormatcher$$default( selector, node ),
            handler = function( e )  {
                e = e || WINDOW.event;
                // early stop in case of default action
                if ( util$eventhandler$$EventHandler.skip === eventType ) return;
                var eventTarget = e.target || node.ownerDocument.documentElement;
                // Safari 6.0+ may fire events on text nodes (Node.TEXT_NODE is 3).
                // @see http://www.quirksmode.org/js/events_properties.html
                eventTarget = eventTarget.nodeType === 3 ? eventTarget.parentNode : eventTarget;
                // Test whether delegated events match the provided `selector` (filter),
                // if this is a event delegation, else use current DOM node as the `currentTarget`.
                var currentTarget = matcher &&
                    // Don't process clicks on disabled elements
                    ( eventTarget.disabled !== true || e.type !== "click" ) ? matcher( eventTarget ) : node,
                    args = props || [];
    
                // early stop for late binding or when target doesn't match selector
                if ( !currentTarget ) return;
    
                // off callback even if it throws an exception later
                if ( once ) el.off( eventType, callback );
    
                if ( props ) {
                    args = helpers$$map( args, function( name )  {return util$eventhandler$$getEventProperty(
                        name, e, eventType, node, eventTarget, currentTarget )} );
                } else {
                    args = helpers$$slice.call( e._trigger || [ 0 ], 1 );
                }
    
                // prevent default if handler returns false
                if ( callback.apply( el, args ) === false ) {
                    e.preventDefault();
                }
            };
    
        if ( hook ) handler = hook( handler, el ) || handler;
    
        handler.eventType  = eventType;
        handler.namespace  = namespace;
        handler.callback   = callback;
        handler.selector   = selector;
    
        return handler;
    }

    var util$eventhandler$$default = util$eventhandler$$EventHandler;

    helpers$$implement({
        
       /**
        * Bind an event to a callback function for one or more events to the selected elements. 
        * @param  {String|Array}  type        event type(s) with optional selector
        * @param  {String}        [selector]  event selector filter
        * @param  {Array}         [args]      array of handler arguments to pass into the callback
        * @param  {Function}      callback    event callback
        */
        on: false,
       /**
        * Bind an event to only be triggered a single time. 
        * @param  {String|Array}    type event type(s) with optional selector
        * @param  {Function|String} callback event callback or property name (for late binding)
        * @param  {Array}           [props] array of event properties to pass into the callback
        */
        once: true
    
    }, function( method, single )  {return function( eventType, selector, args, callback ) {var this$0 = this;
    
        if ( helpers$$is( eventType, "string" ) ) {
            if ( helpers$$is( args, "function" ) ) {
                callback = args;
    
                if ( helpers$$is(selector, "string" ) ) {
                    args = null;
                } else {
                    args = selector;
                    selector = null;
                }
            }
    
            if ( helpers$$is( selector, "function") ) {
                callback = selector;
                selector = null;
                args = null;
            }
    
            if ( !helpers$$is( callback, "function" ) ) {
                minErr$$minErr( method + "()", callback + " is not a function." );
            }
    
            // http://jsperf.com/string-indexof-vs-split
            var node = this[ 0 ],
                parts,
                namespace,
                eventTypes = helpers$$inArray(eventType, " ") >= -1 ? eventType.split(" ") : [ eventType ],
                i = eventTypes.length,
                handler,
                handlers = this._._events || ( this._._events = [] );
    
                // handle namespace
                parts = eventType.split( "." );
                eventType = parts[ 0 ] || null;
                namespace = parts[ 1 ] || null;
    
                handler = util$eventhandler$$default( this, eventType, selector, callback, args, single, namespace );
    
                node.addEventListener( handler._eventType || eventType, handler, !!handler.capturing );
    
                // store event entry
                handlers.push( handler );
    
        } else if ( helpers$$is(eventType, "object") ) {
    
            if ( helpers$$isArray( eventType ) ) {
    
                helpers$$each( eventType, function( name )  {
                    this$0[ method ]( name, selector, args, callback );
                });
            } else {
                helpers$$forOwn( eventType, function( name, value )  {
                    this$0[ method ]( name, selector, args, value );
                });
            }
        } else {
            minErr$$minErr( method + "()", "The first argument need to be a string" );
        }
    
        return this;
    }}, function()  {return RETURN_THIS});


    helpers$$implement({
    
       /**
        * Remove one or many callbacks.
        * @param  {String}          type        type of event
        * @param  {String}          [selector]  event selector
        * @param  {Function|String} [callback] event handler
        */
        off: function(eventType, selector, callback) {
            if ( !helpers$$is( eventType,"string" ) ) minErr$$minErr("off()", "The first argument need to be a string" );
    
            if ( callback === void 0 ) {
                callback = selector;
                selector = void 0;
            }
    
            var self = this,
                node = this[ 0 ],
                parts,
                namespace,
                handlers,
                removeHandler = function( handler )  {
    
                    // Cancel previous frame if it exists
                    if ( self._._raf ) {
                          util$raf$$cancelFrame( self._._raf );
                        // Zero out rAF id used during the animation
                        self._._raf = null;
                    }
                    // Remove the listener
                    node.removeEventListener( ( handler._eventType || handler.eventType ), handler, !!handler.capturing );
                };
    
            parts = eventType.split( "." );
            eventType = parts[ 0 ] || null;
            namespace = parts[ 1 ] || null;
    
            this._._events = helpers$$filter(this._._events, function( handler )  {
    
                var skip = eventType !== handler.eventType;
    
                skip = skip || selector && selector !== handler.selector;
                skip = skip || namespace && namespace !== handler.namespace;
                skip = skip || callback && callback !== handler.callback;
    
                // Bail out if listener isn't listening.
                if ( skip ) return true;
    
                removeHandler( handler );
            });
    
            return this;
        }
    }, null, function()  {return RETURN_THIS});

    helpers$$implement({
       
       /**
        * Trigger one or many events, firing all bound callbacks. 
        * @param  {String}  type  type of event
        * @param  {...Object}     [args]  extra arguments to pass into each event handler
        * @return {Boolean} true if default action wasn't prevented
        */    
        trigger: function(type) {
        var node = this[ 0 ],
            e, eventType, canContinue;
    
        if ( helpers$$is( type, "string" ) ) {
            var hook = util$eventhooks$$default[ type ],
                handler = {};
    
            if ( hook ) handler = hook( handler ) || handler;
    
            eventType = handler._eventType || type;
        } else {
            minErr$$minErr( "trigger()", "The string did not match the expected pattern" );
        }
        // Handles triggering the appropriate event callbacks.
        e = node.ownerDocument.createEvent( "HTMLEvents" );
        e._trigger = arguments;
        e.initEvent( eventType, true, true );
        canContinue = node.dispatchEvent( e );
    
        // call native function to trigger default behavior
        if ( canContinue && node[ type ] ) {
            // prevent re-triggering of the current event
            util$eventhandler$$default.skip = type;
    
            helpers$$invoke( node, type );
    
            util$eventhandler$$default.skip = null;
        }
    
        return canContinue;
      }
    }, null, function()  {return RETURN_TRUE} );

    helpers$$implement({
        /**
         * Extend ugma with methods
         * @param  {Object}    obj       methods container
         * @param  {Boolean} namespace  indicates if the method should be attached to ugma namespace or not
         * @example
         * ugma.extend({
         *     foo: function() {
         *         console.log("bar");
         *     }
         * });
         *
         * ugma.extend({
         *     foo: function() {
         *         console.log("bar");
         *     }
         * }, true);
         *
         *
         * Note! If 'namespace' set to true, the methods can be used like:
         *
         *   ugma.foo();
         *
         * otherwise:
         *
         *   link.foo();
         */
        extend: function(obj, namespace) {
            return obj ? namespace ? helpers$$implement(obj) : helpers$$implement(obj, null, function()  {return RETURN_THIS}) : false;
        }
    });

    var util$accessorhooks$$langFix = /_/g,
        util$accessorhooks$$radioValue, 
        util$accessorhooks$$optSelected, 
        util$accessorhooks$$checkOn,
        util$accessorhooks$$accessorHooks = {
    
            get: {
    
                style: function( node )  {return node.style.cssText},
                title: function( node )  {
                    var doc = node.ownerDocument;
    
                    return ( node === doc.documentElement ? doc : node ).title;
                },
                tabIndex: function( node )  {return node.hasAttribute( "tabindex" ) || FOCUSABLE.test( node.nodeName ) || node.href ? node.tabIndex : -1},
                option: function( node )  {
                    // Support: IE<11
                    // option.value not trimmed
                    return helpers$$trim( node[ node.hasAttribute( "value" ) ? "value" : "text" ] );
                },
                select: function( node )  {return ~node.selectedIndex ? node.options[ node.selectedIndex ].value : ""},
    
                value: function( node )  {
    
                    // Support: Android<4.4
                    // Default value for a checkbox should be "on"
                    if ( node.type === "checkbox" && !util$accessorhooks$$checkOn ) {
                        return node.getAttribute( "value" ) === null ? "on" : node.value;
                    }
                    return node.value;
                },
    
                undefined: function( node )  {
                    switch ( node.tagName ) {
                        case "SELECT":
                            return util$accessorhooks$$accessorHooks.get.select( node );
                        case "OPTION":
                            return util$accessorhooks$$accessorHooks.get.option( node );
                        default:
                            return node[ node.type && "value" in node ? "value" : "innerHTML" ];
                    }
                },
                type: function( node )  {return node.getAttribute( "type" ) || node.type}
            },
    
            set: {
                lang: function( node, value )  {
                    // correct locale browser language before setting the attribute             
                    // e.g. from zh_CN to zh-cn, from en_US to en-us
                    node.setAttribute( "lang", value.replace( util$accessorhooks$$langFix, "-" ).toLowerCase() );
                },
    
                style: function( node, value )  {
                    node.style.cssText = value;
                },
                title: function( node, value )  {
                    var doc = node.ownerDocument;
    
                    ( node === doc.documentElement ? doc : node ).title = value;
                },
                value: function( node, value )  {
    
                    if ( node.tagName === "SELECT" ) {
                        // selectbox has special case
                        if ( helpers$$every.call(node.options, function( o )  {return !( o.selected = o.value === value )} ) ) {
                            node.selectedIndex = -1;
                        }
                    } else {
                        // for IE use innerText for textareabecause it doesn't trigger onpropertychange
                        node.value = value;
                    }
                }
            }
        };

    (function() {
        var input = DOCUMENT.createElement( "input" ),
            select = DOCUMENT.createElement( "select" ),
            opt = select.appendChild( DOCUMENT.createElement( "option" ) );
    
        input.type = "checkbox";
    
        // Support: Android<4.4
        // Default value for a checkbox should be "on"
         util$accessorhooks$$checkOn = input.value !== "";
    
        // Support: IE<=11+
        // Must access selectedIndex to make default options select
         util$accessorhooks$$optSelected = opt.selected;
    
        // Support: IE<=11+
        // An input loses its value after becoming a radio
        input = DOCUMENT.createElement( "input" );
        input.value = "t";
        input.type = "radio";
        util$accessorhooks$$radioValue = input.value === "t";
    })();

    // Support: IE<=11+
    if ( !util$accessorhooks$$radioValue ) {
        util$accessorhooks$$accessorHooks.set.type = function( node, value )  {
    
            if ( value === "radio" ) {
                var val = node.value;
    
                node.setAttribute( "type", val );
                
                if ( value ) node.value = val;
    
            } else {
                node.type = value;
            }
        };
    }

    if ( !util$accessorhooks$$optSelected ) {
        util$accessorhooks$$accessorHooks.get.selected = function( node )  {
            var parent = node.parentNode;
            /* jshint ignore:start */
            if ( parent && parent.parentNode ) {
                parent.parentNode.selectedIndex;
            }
            /* jshint ignore:end */
            return null;
        };
    }

    // Attributes that are booleans
    helpers$$each(("compact nowrap ismap declare noshade disabled readOnly multiple hidden scoped multiple async " +
          "selected noresize defer defaultChecked autofocus controls autoplay autofocus loop").split(" "), function( key ) {
        // For Boolean attributes we need to give them a special treatment, and set 
        // the corresponding property to either true or false
        util$accessorhooks$$accessorHooks.set[ key.toLowerCase() ] = function( node, value )  {
           // completely remove the boolean attributes when set to false, otherwise set it to true
            node[ key ] = !!value ? true : false;
            // set / remove boolean attributes
            node[ !!value ? "setAttribute" : "removeAttribute" ]( value );
        };
    });

    // properties written as camelCase
    helpers$$each((
       // 6.4.3 The tabindex attribute
        ("tabIndex "         +
        "readOnly "         +
        "maxLength "        +
        "cellSpacing "      +
        "cellPadding "      +
        "rowSpan "          +
        "colSpan "          +
        "useMap "           +
        "dateTime  "        +
        "innerHTML "        +
        "frameBorder "      +
        // 6.6.1 Making document regions editable: The contenteditable content attribute
        "contentEditable "  +
        "textContent "      +
        "valueType "        +
        "defaultValue "     +
        "accessKey "        +
        "encType "          +
        "readOnly  "        +
        "vAlign  " + "longDesc")).split(" "), function( key ) {
        util$accessorhooks$$accessorHooks.get[ key.toLowerCase() ] = function( node )  {return node[ key ]};
    });

    var util$accessorhooks$$MSApp = WINDOW.MSApp;
    // Use a 'hook' for innerHTML because of Win8 apps
    util$accessorhooks$$accessorHooks.set.innerHTML = function(node, value)  {
        // Win8 apps: Allow all html to be inserted
        if (typeof util$accessorhooks$$MSApp !== "undefined" && util$accessorhooks$$MSApp.execUnsafeLocalFunction) {
            util$accessorhooks$$MSApp.execUnsafeLocalFunction(function() {
                node.innerHTML = value;
            });
        }
        node.innerHTML = value;
    };

    var util$accessorhooks$$default = util$accessorhooks$$accessorHooks;

    helpers$$implement({
       
      /**
       * Get HTML5 Custom Data Attributes, property or attribute value by name
       * @param  {String|Array}  name  property or attribute name or array of names
       * @return {String|Object} a value of property or attribute
       */
        get: function(name) {var this$0 = this;
            var node = this[ 0 ],
                hook = util$accessorhooks$$default.get[ name ];
    
            // Grab necessary hook if it is defined
            if ( hook ) return hook(node, name);
    
            if ( helpers$$is(name, "string") ) {
                
                // try to fetch HTML5 `data-*` attribute
                if (/^data-/.test( name ) ) {
                    return util$readData$$readData(node, name);
                // if no DOM object property method is present... 
                } else if (name in node) {
                    return node[ name ];
                //... fallback to the getAttribute method
                } else {
                    return node.getAttribute( name );
                }
              // Non-existent / attributes properties return null
              return null;
            } else if (helpers$$isArray(name)) {
                var obj = {};
                helpers$$each( name, function(key)  {
                    obj[ key ] = this$0.get( key );
                });
    
                return obj;
            } else {
                minErr$$minErr("get()", "This operation is not supported" );
            }
        }
    }, null, function()  {return function()  {}});

    helpers$$implement({
      /**
       * Returns true if the requested attribute/property is specified on the given element, and false otherwise.
       * @param  {String} [name] property/attribute name or array of names
       * @return {Boolean} true if exist
       */
        has: function(name) {
            if ( helpers$$is( name, "string" ) ) return !!this[ 0 ][ name ] || this[ 0 ].hasAttribute( name );
    
            minErr$$minErr( "has()", "Not a valid property/attribute" );
        }
    }, null, function()  {return RETURN_FALSE} );

    helpers$$implement({
      /**
       * Append global css styles
       * @param {String}         selector  css selector
       * @param {String}  cssText   css rules
       */
        injectCSS: function(selector, cssText) {
            var styleSheet = this._._styles;
    
            if (!styleSheet) {
                var doc = this[ 0 ].ownerDocument,
                    styleNode = helpers$$injectElement( doc.createElement("style") );
    
                styleSheet = styleNode.sheet || styleNode.styleSheet;
                // store object internally
                this._._styles = styleSheet;
            }
    
            if ( !helpers$$is(selector, "string") || !helpers$$is(cssText, "string") ) {
                minErr$$minErr( "injectCSS()", "The string did not match the expected pattern" );
            }
    
            helpers$$each(selector.split(","), function(selector) {
                try {
                   styleSheet.insertRule(selector + "{" + cssText + "}", styleSheet.cssRules.length);
                } catch(err) {}
            });
        }
    });

    helpers$$implement({
      /**
       * Import external scripts on the page and call optional callback when it will be done
       * @param {...String} urls       script file urls
       * @param {Function}  [callback] callback that is triggered when all scripts are loaded
       */
        injectScript: function() {
            var urls = helpers$$sliceArgs( arguments ),
                doc = this[ 0 ].ownerDocument,
                callback = function()  {
    
                    var arg = urls.shift(),
                        script;
    
                    if (helpers$$is(arg, "string")) {
    
                        script = doc.createElement( "script" );
                        script.onload = callback;
    
                        // Support: IE9
                        // Bug in IE force us to set the 'src' after the element has been
                        // added to the document.
                        helpers$$injectElement( script );
    
                        script.src = arg;
                        script.async = true;
                        script.type = "text/javascript";
    
                    } else if ( helpers$$is(arg, "function") ) {
                        arg();
                    } else if ( arg ) {
                        minErr$$minErr("injectScript()", "Wrong amount of arguments." );
                    }
                };
    
            callback();
        }
    });

    // https://dom.spec.whatwg.org
    // 
    // Section: 4.2.5 Interface ChildNode

    helpers$$implement({
        // Inserts nodes after the last child of node, while replacing strings 
        // in nodes with native element or equivalent html string.
        append: [ "beforeend", true, false, function( node, relatedNode )  {
            node.appendChild( relatedNode );
        }],
        // Inserts nodes before the first child of node, while replacing strings 
        // in nodes with native element or equivalent html strings.
        prepend: [ "afterbegin", true, false, function( node, relatedNode )  {
            node.insertBefore( relatedNode, node.firstChild );
        }],
        // Insert nodes just before node while replacing strings in nodes with 
        // native element or a html string.
        before: [ "beforebegin", true, true, function( node, relatedNode )  {
            node.parentNode.insertBefore( relatedNode, node );
        }],
        // Insert nodes just after node while replacing strings in nodes with 
        // native element or a html string .
        after: [ "afterend", true, true, function( node, relatedNode )  {
            node.parentNode.insertBefore( relatedNode, node.nextSibling );
        }],
        // Replaces node with nodes, while replacing strings in nodes with 
        // native element or html string.
        replaceWith: [ "", false, true, function( node, relatedNode )  {
            node.parentNode.replaceChild( relatedNode, node );
        }],
        remove: [ "", false, true, function( node )  {
            node.parentNode.removeChild( node );
        }]
    }, function(methodName, adjacentHTML, native, requiresParent, strategy)  {return function() {var this$0 = this;
        
          var contents = helpers$$sliceArgs( arguments ),
              node = this[ 0 ];
    
        if ( requiresParent && !node.parentNode ) return this;
    
        if ( ( methodName === "after" || methodName === "before" ) && this === core$core$$ugma ) {
             minErr$$minErr( methodName + "()", "You can not  " + methodName + " an element non-existing HTML (documentElement)" );
        }
        
        // don't create fragment for adjacentHTML
        var fragment = adjacentHTML ? "" : node.ownerDocument.createDocumentFragment();
    
        contents.forEach( function( content )  {
    
            // Handle native DOM elements 
            // e.g. link.append(document.createElement('li'));
            if (native && content.nodeType === 1) {
                content = core$core$$nodeTree( content );
            }
    
            if ( helpers$$is( content, "function" ) ) {
                content = content( this$0 );
            }
    
            // merge a 'pure' array into a string
            if ( helpers$$isArray( content ) && !helpers$$is( content[ 0 ], "object" ) ) {
                content = content.join();
            }
    
            if ( helpers$$is( content, "string" ) ) {
                if (helpers$$is( fragment, "string" ) ) {
                    fragment += helpers$$trim( content );
                } else {
                    content = core$core$$ugma.renderAll( content );
                }
            } else if ( content._ ) {
                content = [ content ];
            }
            
            // should handle documentFragment
            if ( content.nodeType === 11 ) {
                fragment = content;
            } else {
                if ( helpers$$isArray( content ) ) {
                    if ( helpers$$is( fragment, "string" ) ) {
                        // append existing string to fragment
                        content = core$core$$ugma.renderAll( fragment ).concat( content );
                        // fallback to document fragment strategy
                        fragment = node.ownerDocument.createDocumentFragment();
                    }
    
                    helpers$$each( content, function( el ) {
                        fragment.appendChild( el._ ? el[ 0 ] : el );
                    });
                }
            }
        });
    
        if ( helpers$$is( fragment, "string" ) ) {
            node.insertAdjacentHTML( adjacentHTML, fragment );
        } else {
            strategy( node, fragment );
        }
    
        return this;
    }}, function()  {return RETURN_THIS});

    helpers$$implement({
      /**
         * Invokes a function for element if it's not empty and return array of results
         * @param  {Function}  fn         function to invoke
         * @param  {Object}    [context]  execution context
         * @return {Array} an empty array or array with returned value
         */
        map: function(fn, context) {
            if ( !helpers$$is( fn, "function" ) ) minErr$$minErr( "map()", "This operation is not supported" );
            return [ fn.call( ( context ), this) ];
        }
    }, null, function()  {return function()  {return []}} );

    var util$pseudoClasses$$pseudoClasses = {
    
            ":input": function( node )  {return FOCUSABLE.test(node.nodeName)},
    
            ":selected": function( node )  {
                // Accessing this property makes selected-by-default
                // options in Safari work properly
                /* jshint ignore:start */
                if ( node.parentNode ) {
                    node.parentNode.selectedIndex;
                }
                /* jshint ignore:end */
                return node.selected === true;
            },
            ":enabled": function( node )   {return !node.disabled},
            ":disabled": function( node )  {return node.disabled},
            // In CSS3, :checked should return both checked and selected elements
            // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    
            ":checked": function( node )  {return !!("checked" in node ? node.checked : node.selected)},
    
            ":focus": function( node )  {return node === node.ownerDocument.activeElement},
    
            ":visible": function( node )  {return !util$pseudoClasses$$pseudoClasses[ ":hidden" ](node)},
    
            ":hidden": function( node )  {return node.style.visibility === "hidden" || node.style.display === "none"} 
        };

    function util$pseudoClasses$$createButtonPseudo( type ) {
        return function( node )  {
            var name = node.nodeName;
            return (name === "INPUT" || name === "BUTTON") && node.type === type;
        };
    }

    function util$pseudoClasses$$createInputPseudo( type ) {
        return function( node )  {
            var name = node.nodeName;
            return name === "INPUT" && node.type === type;
        };
    }

    // Add button/input type pseudos
    helpers$$forOwn({ radio: true, checkbox: true, file: true, text: true, password: true, image: true }, function( key, value )  {
        util$pseudoClasses$$pseudoClasses[ ":" + key ] = util$pseudoClasses$$createInputPseudo( key );
    });

    helpers$$forOwn({ submit: true, reset: true }, function( key, value )  {
        util$pseudoClasses$$pseudoClasses[ ":" + key ] = util$pseudoClasses$$createButtonPseudo( key );
    });

    var util$pseudoClasses$$default = util$pseudoClasses$$pseudoClasses;
    helpers$$implement({
       /**
         * Check if the element matches a selector against an element
         * @param  {String}   selector  css selector for checking
         * @return {Boolean} returns true if success and false otherwise
         */
        matches: function(selector) {
            if ( !selector || !helpers$$is(selector, "string") ) minErr$$minErr("matches()", "The string did not match the expected pattern" );
                // compare a match with CSS pseudos selectors 
                // e.g "link.matches(":enabled") or "link.matches(":checked")
                var checker = util$pseudoClasses$$default[ selector ] ||  util$selectormatcher$$default( selector );
                return !!checker( this[ 0 ] );
        }
    }, null, function()  {return RETURN_FALSE} );

    helpers$$implement({
       /**
        * Calculates offset of the current element
        * @return object with left, top, bottom, right, width and height properties
        */
        offset: function() {
    
            var node = this[ 0 ],
                docEl = node.ownerDocument.documentElement,
                clientTop = docEl.clientTop,
                clientLeft = docEl.clientLeft,
                scrollTop = WINDOW.pageYOffset || docEl.scrollTop,
                scrollLeft = WINDOW.pageXOffset || docEl.scrollLeft,
                boundingRect = node.getBoundingClientRect();
    
            return {
                top: boundingRect.top + scrollTop - clientTop,
                left: boundingRect.left + scrollLeft - clientLeft,
                right: boundingRect.right + scrollLeft - clientLeft,
                bottom: boundingRect.bottom + scrollTop - clientTop,
                width: boundingRect.right - boundingRect.left,
                height: boundingRect.bottom - boundingRect.top
            };
        }
    }, null, function()  {return function()  { return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 } }} );

    helpers$$implement({
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
            var node = this[ 0 ],
                offsetParent = node.offsetParent || HTML,
                isInline = this.css( "display" ) === "inline";
    
            if (!isInline && offsetParent) {
                return core$core$$nodeTree( offsetParent );
            }
    
            while ( offsetParent && core$core$$nodeTree(offsetParent).css( "position" ) === "static" ) {
                offsetParent = offsetParent.offsetParent;
            }
    
            return core$core$$nodeTree(offsetParent);
        }
    }, null, function()  {return RETURN_FALSE});

    var modules$query$$siblings = /[\x20\t\r\n\f]*[+~>]/,
        modules$query$$fasting  = /^(?:(\w+)|\.([\w\-]+))$/,
        modules$query$$rescape  = /'|\\/g;

    helpers$$implement({
     /**
      * Find the first matched element by css selector
      * @param  {String} selector css selector
      */
        query: "",
     /**
      * Find all matched elements by css selector
      * @param  {String} selector css selector
      */
       queryAll: "All"
    
    }, function(methodName, all)  {return function(selector) {
        if (typeof selector !== "string") minErr$$minErr();
    
        var node = this[ 0 ],
            quickMatch = modules$query$$fasting.exec(selector),
            result, old, nid, context;
    
        if (quickMatch) {
            if (quickMatch[ 1 ]) {
                // speed-up: "TAG"
                result = node.getElementsByTagName( selector );
            } else {
                // speed-up: ".CLASS"
                result = node.getElementsByClassName( quickMatch[ 2 ] );
            }
    
            if ( result && !all ) result = result[ 0 ];
            
        } else {
            old = true;
            context = node;
    
            if (node !== node.ownerDocument.documentElement) {
                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                if ( (old = node.getAttribute( "id" )) ) {
                    nid = old.replace( modules$query$$rescape, "\\$&" );
                } else {
                    nid = "__ugma_trackira__";
                    node.setAttribute("id", nid);
                }
    
                nid = "[id='" + nid + "'] ";
                
                context = modules$query$$siblings.test(selector) ? node.parentNode : node;
                
                selector = nid + selector.split(",").join("," + nid);
            }
    
            result = helpers$$invoke(context, "querySelector" + all, selector);
    
            if (!old) node.removeAttribute("id");
        }
    
            return all ? helpers$$map(result, core$core$$nodeTree) : core$core$$nodeTree(result);
            
    }}, function(methodName, all)  {return function()  {return all ? [] : new core$core$$dummyTree()}});

    var modules$ready$$readyCallbacks = [],
        // Supports: IE9+
        // IE have issues were the browser trigger the interactive state before DOMContentLoaded.
        modules$ready$$loaded = ( HTML.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/ ).test( DOCUMENT.readyState ),
        modules$ready$$pageLoaded;



    if ( !modules$ready$$loaded )
        DOCUMENT.addEventListener( "DOMContentLoaded", modules$ready$$pageLoaded = function()  {
            DOCUMENT.removeEventListener("DOMContentLoaded", modules$ready$$pageLoaded);
            modules$ready$$loaded = 1;
            while ( modules$ready$$pageLoaded = modules$ready$$readyCallbacks.shift() ) modules$ready$$pageLoaded();
        });

    helpers$$implement({
      /**
       * Execute callback when DOM is ready
       * @param {Function} callback event listener
       */
        ready: function( fn ) {
            if ( !helpers$$is( fn, "function") ) minErr$$minErr("ready()", "The provided 'callback' is not a function.");
    
            if ( modules$ready$$loaded ) {
                fn();
            } else {
                modules$ready$$readyCallbacks.push( fn );
            }
        }
    });

    var modules$set$$objectTag = "[object Object]",
        modules$set$$getTagName = function( node )  {
        var tag = node.tagName;
       return (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "OPTION");
   };

    helpers$$implement({
      /**
       * Set property/attribute value by name
       * @param {String|Object|Array}   name    property/attribute name
       * @param {String|Function}       value   property/attribute value or functor
       */
        set: function(name, value) {var this$0 = this;
    
            var node = this[ 0 ];
    
            if ( arguments.length === 1 ) {
                if ( helpers$$is( name, "function" ) ) {
                    value = name;
                } else {
                    value = name == null ? "" : name + "";
                }
    
                if ( value !== modules$set$$objectTag ) {
    
                    if ( modules$set$$getTagName( node ) ) {
                        name = "value";
                    } else {
                        name = "innerHTML";
                    }
                }
            }
    
            var hook = util$accessorhooks$$default.set[ name ],
                subscription = ( this._._subscription || {} )[ name ],
                previousValue;
    
            // grab the previous value if it's already a subscription on this attribute / property,
            if ( subscription ) {
                previousValue = this.get( name );
            }
    
            if ( helpers$$is(name, "string" ) ) {
                
                if (helpers$$is(value, "function")) {
                    value = value( this );
                }
    
                if ( hook ) {
                    hook( node, value );
                } else if ( value == null ) {
                    // removes an attribute from an HTML element.
                    node.removeAttribute( name || name.toLowerCase() );
                } else if ( name in node ) {
                    node[ name ] = value;
                } else {
                    // node's attribute
                    node.setAttribute( name, value );
                }
                // set array of key values
                // e.g. link.set(["autocomplete", "autocorrect"], "off");
            } else if (helpers$$isArray( name )) {
                helpers$$each(name, function( key )  { this$0.set(key, value) } );
            // Set the value (with attr map support)
            } else if ( helpers$$is( name, "object" ) ) {
                helpers$$forOwn( name, function( key, value )  { this$0.set( key, name[ key ] ) } );
            } else {
                minErr$$minErr( "set()", "The property or attribute is not valid." );
            }
    
            if ( subscription && previousValue !== value ) {
                // Trigger all relevant attribute / nameerty changes.
                helpers$$each(subscription, function( cb )  { helpers$$invoke(this$0, cb, value, previousValue) } );
            }
    
            return this;
        }
    }, null, function()  {return RETURN_THIS} );

    // shadow() method are developed after ideas located here: onhttp://www.w3.org/TR/shadow-dom/   
    // Shadow is not the same as Shadow DOM, but follow the same syntax. Except a few differences.
    //
    // - unlike shadow DOM you can have several shadows for a single DOM element.
    // - each shadow *must* have it's unique name
    // - each shadow can be removed with the remove() method. E.g. el.shadow("foo").remove();       
    // - the shadow root - as mentioned in the specs - is a instance of a new document, and has it
    //   own methods such as query[All] Returned value of the method is Element that represents 
    //   the shadow in the main document tree. Allmost the same as the specs.
    //
    // Equalities to the specs:
    // ------------------------
    //
    // - internal DOM events do not bubble into the document tree
    // - subtree is not accessible via query[All] (neither native querySelector[All]) 
    //   because it's in another document.
    //
    // Note! There are more cons then pros in this, and it's important to know that the shadow() method
    // is not SEO friendly
    //        
    var modules$shadow$$MUTATION_WRAPPER = "div[style=overflow:hidden]>object[data=`about:blank` type=text/html style=`position:absolute` width=100% height=100%]";

    if ( INTERNET_EXPLORER ) {
        modules$shadow$$MUTATION_WRAPPER = modules$shadow$$MUTATION_WRAPPER.replace( "position:absolute", "width:calc(100% + 4px);height:calc(100% + 4px);left:-2px;top:-2px;position:absolute").replace( "data=`about:blank` ", "" );
    }

    // Chrome/Safari/Opera have serious bug with tabbing to the <object> tree:
    // https://code.google.com/p/chromium/issues/detail?id=255150
    helpers$$implement({
        shadow: function(name) {var callback = arguments[1];if(callback === void 0)callback = function()  {};
            var contexts = this._._shadow || ( this._._shadow = {} ),
                data = contexts[name] || [];
    
            if (data[ 0 ] ) {
                // callback is always async
                WINDOW.setTimeout(function()  { callback(data[ 1 ] ) }, 1 );
    
                return data[ 0 ];
            }
    
            var ctx = core$core$$ugma.render(modules$shadow$$MUTATION_WRAPPER),
                object = ctx.get("firstChild");
            // set onload handler before adding element to the DOM
            object.onload = function()  {
                // apply user-defined styles for the context
                if ( ctx.addClass(name).css("position") === "static" ) ctx.css("position", "relative");
    
                // store new context root internally and invoke callback
                callback( data[ 1 ] = new core$core$$domTree( object.contentDocument ) );
            };
    
            this.before( ctx );
    
            if ( INTERNET_EXPLORER ) object.data = "about:blank";
    
            // store context data internally
            contexts[ name ] = data;
    
            return data[ 0 ] = ctx;
        }
    }, null, function()  {return function()  {return RETURN_FALSE}} );

    helpers$$implement({
    
        /**
         * Get / set text content of a node
         * @param  {String}   value   
         */
        text: "textContent",
        /**
         * Get / set HTML content of a node
         * @param  {String}   value   
         */
        html: "innerHTML",
        /**
         * Get / set the value attribute on a node
         * @param  {String}   value 
         */
        attr: "attribute",
    }, function( methodName, propertyName )  {return function( value ) {
    
        if ( arguments.length === 0 ) {
            return this.get( methodName );
        }
        this.set( methodName, value );
    
    }}, function( methodName )  {return function()  {return function()  {return RETURN_THIS}}} );

    helpers$$implement({
      /**
       * Subscribe on particular properties / attributes, and get notified if they are changing
       * @param  {String}   name     property/attribute name
       * @param  {Function}  callback  function for notifying about changes of the property/attribute
       */
        subscribe: function(name, callback) {
                var subscription = this._._subscription || ( this._._subscription = [] );
    
                if ( !subscription[ name ]) subscription[ name ] = [];
    
                subscription[ name ].push( callback );
    
                return this;
            },
     /**
      * Cancel / stop a property / attribute subscription
      * @param  {String}   name    property/attribute name
      * @param  {Function}  callback  function for notifying about changes of the property/attribute
      */
       unsubscribe: function(name, callback) {
                var subscription = this._._subscription;
    
                if ( subscription[ name ] ) subscription[ name ] = helpers$$filter( subscription[ name ], function( cb )  {return cb !== callback} );
    
                return this;
            }
    }, null, function()  {return RETURN_THIS} );

    helpers$$implement({
        /**
         * Find first element filtered by optional selector
         * @param {String} [selector] css selector
         * @param {Boolean} [andSelf] if true than search will start from the current element
         * @function
         */
        first: "firstElementChild",
        /**
         * Find last element filtered by optional selector
         * @param {String} [selector] css selector
         * @param {Boolean} [andSelf] if true than search will start from the current element
         * @function
         */
        last: "lastElementChild",
        /**
         * Find next sibling element filtered by optional selector
         * @param {String} [selector] css selector
         * @param {Boolean} [andSelf] if true than search will start from the current element
         * @function
         */
        next: "nextElementSibling",
        /**
         * Find previous sibling element filtered by optional selector
         * @param {String} [selector] css selector
         * @param {Boolean} [andSelf] if true than search will start from the current element
         * @function
         */
        prev: "previousElementSibling",
        /**
         * Find all next sibling elements filtered by optional selector
         * @param {String} [selector] css selector
         * @param {Boolean} [andSelf] if true than search will start from the current element
         * @function
         */
        nextAll: "nextElementSibling",
        /**
         * Find all previous sibling elements filtered by optional selector
         * @param {String} [selector] css selector
         * @param {Boolean} [andSelf] if true than search will start from the current element
         * @function
         */
        prevAll: "previousElementSibling",
    }, function(methodName, propertyName)  {return function(selector, andSelf) {
    
        if ( selector && !helpers$$is( selector, "string" ) ) minErr$$minErr( methodName + "()", "The provided argument did not match the expected pattern" );
    
        var all = methodName.slice( -3 ) === "All",
            matcher = util$selectormatcher$$default( selector ),
            descendants = all ? [] : null,
            currentNode = this[ 0 ];
    
        if (!matcher) currentNode = currentNode[propertyName];
    
        for (; currentNode; currentNode = currentNode && !andSelf ? currentNode[ propertyName ] : currentNode) {
            if ( currentNode.nodeType === 1 && ( !matcher || matcher( currentNode ) ) ) {
                if ( !all ) break;
    
                descendants.push( currentNode );
            }
        }
    
        return all ? helpers$$map( descendants, core$core$$nodeTree ) : core$core$$nodeTree( currentNode );
    }}, function( methodName )  {return function()  {return methodName.slice( -3 ) === "All" ? [] : new core$core$$dummyTree()}} );

    helpers$$implement({
        /**
         * Read or write inner content of the element
         * @param  {Mixed}  [content]  optional value to set
         * @function
         */    value: function(val) {
            if ( arguments.length === 0 ) {
                return this.get();
            }
    
            if (val._ || helpers$$isArray( val ) ) {
                return this.set( "" ).append( val );
            }
    
           return this.set( val );
        }
    }, null, function()  {return function() {
        if ( arguments.length ) return this;
    }});

    helpers$$implement({
            // Show a single element
            show: false,
            // Hide a single element
            hide: true,
            // Toggles the CSS `display` of `element`
            toggle: null
    
        }, function( methodName, condition )  {return function( state, callback ) {var this$0 = this;
    
            // Boolean toggle()
            if ( methodName === "toggle" && helpers$$is( state, "boolean" ) ) {
                condition = state;
                state = null;
            }
    
            if ( !helpers$$is( state, "string" ) ) {
                callback = state;
                state = null;
            }
    
            if ( callback && typeof callback !== "function") {
                minErr$$minErr( methodName + "()", "This operation is not supported" );
            }
    
            var node = this[ 0 ],
                style = node.style,
                computed = helpers$$computeStyle( node ),
                hiding = condition,
                frameId = this._._frame,
                done = function()  {
                    this$0.set("aria-hidden", String( hiding ) );
    
                    style.visibility = hiding ? "hidden" : "inherit";
    
                    this$0._._frame = null;
    
                    if ( callback ) callback( this$0 );
                };
    
            if ( !helpers$$is( hiding, "boolean" ) ) {
                hiding = computed.visibility !== "hidden";
            }
    
            // cancel previous frame if it exists
            if ( frameId ) util$raf$$cancelFrame( frameId );
    
            if ( !node.ownerDocument.documentElement.contains( node ) ) {
                done();
            } else {
                this._._frame = util$raf$$requestFrame( done );
            }
    
            return this;
    
    }}, function()  {return function()  {return RETURN_THIS}});

    var template$format$$reVar = /\{([\w\-]+)\}/g;

    // 'format' a placeholder value with it's original content 
    // @example
    // ugma.format('{0}-{1}', [0, 1]) equal to '0-1')
    core$core$$ugma.format = function(template, varMap) {
        // Enforce data types on user input
        if (!helpers$$is(template, "string")) template = String(template);
    
        if ( !varMap || !helpers$$is(varMap, "object") ) varMap = {};
    
        return template.replace(template$format$$reVar, function(placeholder, name, index)  {
            if ( name in varMap ) {
                placeholder = varMap[ name ];
    
                if ( helpers$$is( placeholder, "function") ) placeholder = placeholder( index );
    
                placeholder = String(placeholder);
            }
    
            return placeholder;
        });
    };

    var template$indexing$$reIndex = /(\$+)(?:@(-)?(\d+)?)?/g,
        template$indexing$$reDollar = /\$/g,
        template$indexing$$indexing = function( num, term )  {
            var index = num = num >= 1600 ? /* max 1600 HTML elements */ 1600 : ( num <= 0 ? 1 : num ),
                result = new Array( index );
    
            while (index--) {
                result[ index ] = term.replace( template$indexing$$reIndex, function( expr, fmt, sign, base )  {
                    var pos = ( sign ? num - index - 1 : index ) + ( base ? +base : 1 );
                    // handle zero-padded index values, like $$$ etc.
                    return ( fmt + pos ).slice( -fmt.length ).replace( template$indexing$$reDollar, "0" );
                });
            }
            return result;
        };

    function template$injection$$injection(term, adjusted) {
        return function( html )  {
             // find index of where to inject the term
             var index = adjusted ? html.lastIndexOf( "<" ) : html.indexOf( ">" );
             // inject the term into the HTML string
             return html.slice( 0, index ) + term + html.slice( index );
         };
     }

    var template$operators$$default = {
        "(" : 1,
        ")" : 2,
        "^" : 3,
        ">" : 4,
        "+" : 5,
        "*" : 6,
        "`" : 7,
        "[" : 8,
        "." : 8,
        "#" : 8
    };

    function template$parseAttr$$parseAttr( quote, name, value, rawValue ) {
        // try to determine which kind of quotes to use
        quote = value && helpers$$inArray( value, "\"" ) >= 0 ? "'" : "\"";
    
        if ( helpers$$is( rawValue, "string" ) ) {
            value = rawValue;
        } 
        
        if ( !helpers$$is( value, "string" ) ) {
            value = name;
        }
        return " " + name + "=" + quote + value + quote;
    }

    /* es6-transpiler has-iterators:false, has-generators: false */

    // Reference: https://github.com/emmetio/emmet

    var template$template$$dot = /\./g,
        template$template$$abbreviation = /`[^`]*`|\[[^\]]*\]|\.[^()>^+*`[#]+|[^()>^+*`[#.]+|\^+|./g,
        template$template$$templateHooks = {},
        template$template$$tagCache = { "": "" };

    // Expose 'templateHooks' to the global scope
    core$core$$ugma.templateHooks = function(obj)   {
    
      if( !helpers$$is( obj, "object" ) ) minErr$$minErr( "templateHooks()", "... has to be a object" );
    
      helpers$$forOwn(obj, function( key, value )  {
            template$template$$templateHooks[ key ] = value;
        });
    };

    core$core$$ugma.template = function( template, args ) {
    
        if ( !helpers$$is(template, "string" ) ) minErr$$minErr("template()", "The first argument need to be a string");
    
        if ( args ) template = core$core$$ugma.format( template, args );
    
        // use template hooks if they exist
        var hook = template$template$$templateHooks[ template ];
        
        template = hook && helpers$$is( hook, "string" ) ? hook : template;
    
        if ( template in template$template$$tagCache ) return template$template$$tagCache[ template ];
    
        var stack = [],
            output = [];
    
        helpers$$each(template.match( template$template$$abbreviation ), function( str )  {
    
            if ( template$operators$$default[ str[ 0 ] ] ) {
                if ( str !== "(" ) {
                    // for ^ operator need to skip > str.length times
                    for ( var i = 0, n = (str[ 0 ] === "^" ? str.length : 1 ); i < n; ++i ) {
                        while ( stack[ 0 ] !== str[ 0 ] && template$operators$$default[ stack[ 0 ] ] >= template$operators$$default[ str[ 0 ] ] ) {
                            var head = stack.shift();
                            output.push( head );
                            // for ^ operator stop shifting when the first > is found
                            if ( str[ 0 ] === "^" && head === ">" ) break;
                        }
                    }
                }
    
                if ( str === ")" ) {
                    stack.shift(); // remove "(" symbol from stack
                } else {
                    // handle values inside of `...` and [...] sections
                    if ( str[ 0 ] === "[" || str[ 0 ] === "`" ) {
                        output.push( str.slice(1, -1) );
                    }
                    // handle multiple classes, e.g. a.one.two
                    if ( str[ 0 ] === "." ) {
                        output.push( str.slice( 1 ).replace( template$template$$dot, " ") );
                    }
    
                    stack.unshift( str[ 0 ] );
                }
            } else {
                output.push( str );
            }
        });
    
        output = output.concat( stack );
    
        return template$process$$process( output );
    };

    // populate templateHooks
    helpers$$forOwn({
          "kg"    : "keygen",
          "out"   : "output",
          "det"   : "details",
          "cmd"   : "command",
          "datal" : "datalist",
          "ftr"   : "footer",
          "adr"   : "adress",
          "dlg"   : "dialog",
          "art"   : "article",
          "leg"   : "legend",
          "sect"  : "section",
          "ol+"   : "ol>li",
          "ul+"   : "ul>li",
          "dl+"   : "dl>dt+dd",
          "tr+"   : "tr>td",
      }, function( key, value )  {
          template$template$$templateHooks[ key ] = value;
      });

    // populate empty tag names with result
    helpers$$each( "area base br col hr img input link meta param command keygen source".split(" "), function( tag )  { template$template$$tagCache[ tag ] = "<" + tag + ">" });

    var template$template$$default = template$template$$tagCache;
    // return tag's from tagCache with <code>tag</code> type
    function template$processTag$$processTag(tag) {
        return template$template$$default[tag] || (template$template$$default[tag] = "<" + tag + "></" + tag + ">");
    }

    /* es6-transpiler has-iterators:false, has-generators: false */

    var template$process$$attributes = /\s*([\w\-]+)(?:=((?:`([^`]*)`)|[^\s]*))?/g,
        template$process$$charMap = { 
            "&": "&amp;",    // ampersand
            "<": "&lt;",     // less-than
            ">": "&gt;",     // greater-than
            "\"": "&quot;", 
            "'": "&#039;",
            "¢": "&#162;",   // cent
            "¥": "&#165;",   // yen
            "§": "&#167;",   // section
            "©": "&#169;",   // copyright
            "®": "&#174;",   // registred trademark
            "™": "&#8482;",  // trademark
        },
        // filter for escaping unsafe XML characters: <, >, &, ', " and
        // prevent XSS attacks
        template$process$$escapeChars = function( str )  {return str.replace( /[&<>"'¢¥§©®™]/g, function( ch )  {return template$process$$charMap[ ch ]})},
        template$process$$process = function( template )  {
    
        var stack = [];
    
        helpers$$each(template, function(str)  {
    
            if ( str in template$operators$$default ) {
    
                var value = stack.shift(),
                    node = stack.shift();
    
                if ( helpers$$is( node, "string" ) ) {
                    
                    node = [ template$processTag$$processTag( node ) ];
                }
    
                if ( helpers$$is( node, "undefined" ) || helpers$$is( value, "undefined" ) ) {
                    minErr$$minErr("emmet()", "This operation is not supported" );
                }
    
                if (str === "#" ) { // id
                    value = template$injection$$injection(" id=\"" + value + "\"" );
                } else if ( str === "." ) { // class
                    value = template$injection$$injection(" class=\"" + value + "\"" );
                } else if ( str === "[" ) { // id
                    value = template$injection$$injection( value.replace( template$process$$attributes, template$parseAttr$$parseAttr ) );
                } else if ( str === "*" ) { // universal selector 
                    node = template$indexing$$indexing( +value, node.join( "" ) );
                } else if ( str === "`" ) { // Back tick
                    stack.unshift(node);
                    // escape unsafe HTML symbols
                    node = [ template$process$$escapeChars( value ) ];
                } else { /* ">", "+", "^" */
                    value = helpers$$is( value, "string" ) ? template$processTag$$processTag( value ) : value.join( "" );
    
                    if ( str === ">" ) {
                        value = template$injection$$injection( value, true );
                    } else {
                        node.push( value );
                    }
                }
    
                str = helpers$$is( value, "function" ) ? node.map( value ) : node;
            }
    
            stack.unshift( str );
        });
    
        return template.length === 1 ? template$processTag$$processTag( stack[ 0 ] ) : stack[ 0 ].join( "" );
    };

    helpers$$implement({
         /**
         * Create a new nodeTree from Emmet or HTML string in memory
         * @param  {String}       value     Emmet or HTML string
         * @param  {Object|Array} [varMap]  key/value map of variables
         */
        render: "",
        /**
         * Create a new array of nodeTree from Emmet or HTML string in memory
         * @param  {String}       value     Emmet or HTML string
         * @param  {Object|Array} [varMap]  key/value map of variables
         * @function
         */    
        renderAll: "All"
    
    }, function(methodName, all)  {return function(value, varMap) {
    
        // Create native DOM elements
        // e.g. "document.createElement('div')"
        if (value.nodeType === 1) return core$core$$nodeTree(value);
    
        if (!helpers$$is(value, "string")) minErr$$minErr(methodName + "()", "Not supported.");
    
        var doc = this[0].ownerDocument,
            sandbox = this._._sandbox || (this._._sandbox = doc.createElement("div"));
    
        var nodes, el;
    
        if ( value && value in template$template$$default ) {
    
            nodes = doc.createElement( value );
    
            if ( all ) nodes = [ new core$core$$nodeTree( nodes ) ];
    
        } else {
    
            value = helpers$$trim( value );
    
            // handle vanila HTML strings
            // e.g. <div id="foo" class="bar"></div>
            if (value[ 0 ] === "<" && value[ value.length - 1 ] === ">" && value.length >= 3 ) {
    
                value = varMap ? core$core$$ugma.format( value, varMap ) : value;
    
            } else { // emmet strings
                value = core$core$$ugma.template( value, varMap );
            }
    
            sandbox.innerHTML = value; // parse input HTML string
    
            for ( nodes = all ? [] : null; el = sandbox.firstChild; ) {
                sandbox.removeChild( el ); // detach element from the sandbox
    
                if (el.nodeType === 1) {
    
                    if ( all ) {
                        nodes.push( new core$core$$nodeTree( el ) );
                    } else {
                        nodes = el;
    
                        break; // stop early, because need only the first element
                    }
                }
            }
        }
        return all ? nodes : core$core$$nodeTree( nodes );
    }});
    // Current codename on the framework.
    core$core$$ugma.version = "trackira";

    // Current version of the library. Keep in sync with `package.json`.
    core$core$$ugma.version = "0.0.1";

    // Map over 'ugma' in case of overwrite
    var outro$$_ugma = WINDOW.ugma;

    // Runs ugma in *noConflict* mode, returning the original `ugma` namespace.
    core$core$$ugma.noConflict = function() {
        if ( WINDOW.ugma === core$core$$ugma ) {
            WINDOW.ugma = outro$$_ugma;
        }
    
        return core$core$$ugma;
    };

    WINDOW.ugma = core$core$$ugma;
})();
