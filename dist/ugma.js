/**
 * Javascript framework 0.0.3a
 * https://github.com/ugma/ugma
 * 
 * Copyright 2014 - 2015 Kenny Flashlight
 * Released under the MIT license
 * 
 * Build date: Wed, 08 Apr 2015 13:10:22 GMT
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

    /**
     * Invokes the `callback` function once for each item in `arr` collection, which can only be an array.
     *
     * @param {Array} collection
     * @param {Function} callback
     * @return {Array}
     * @private
     */
    var helpers$$each = function( collection, callback )  {
               var arr = collection || [],
                   index = -1,
                   length = arr.length;
               while ( ++index < length ) {
                   if ( callback( arr[ index ], index, arr ) === false ) {
                       break;
                   }
               }
           return arr;
       },
   
      /**
       * Create a new collection by executing the callback for each element in the collection.
       * @example
       *     link.map(function(element) {
       *         return element.getAttribute('name')
       *     });
       *     // ['ever', 'green']
       */     
        
       helpers$$map = function( collection, callback )  {
           var arr = collection || [],
               result = [];
         // Go through the array, translating each of the items to their
         // new value (or values).
           helpers$$each(arr, function( value, key )  {
               result.push( callback( value, key ) );
           });
           return result;
       },
   
    /**
      * Return a boolean for if typeof obj is exactly type.
      *
      * @param {String} [obj] String to test whether or not it is a typeof.
      * @param {String} [type] String that should match the typeof
      * @return {boolean} 
      * @example
      *     is(function(), "function");
      *     // true
      * @example
      *     is({}, "function");
      *     // false
      */    
       helpers$$is = function( obj, type )  {
           return typeof obj === type;
       },
   
       // Iterates over own enumerable properties of an object, executing  the callback for each property.
       helpers$$forOwn = function( object, callback )  {
   
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
   
      /**
       * Create a new array with all elements that pass the test implemented by the provided function
       * @example
       *     link.filter('.active');
       * @example
       *     link.filter(function(element) {
       *         return element.hasAttribute('active')
       *     });
       */    
       
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
   
       helpers$$inArray = function( arr, searchElement, fromIndex )  {
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
               return fn.call( context, arg1, arg2 );
           } catch ( err ) {
               WINDOW.setTimeout( function()  { throw err }, 1 );
   
               return false;
           }
       },
   
       // Faster alternative then slice.call
       helpers$$sliceArgs = function( arg )  {
           var i = arg.length,
               args = new Array( i || 0 );
   
           while ( i-- ) {
               args[ i ] = arg[ i ];
           }
           return args;
       },
   
       helpers$$reDash = /([\:\-\_]+(.))/g,
       helpers$$mozHack = /^moz([A-Z])/,
   
    /**
     * Convert a string to camel case notation.
     * @param  {String} str String to be converted.
     * @return {String}     String in camel case notation.
     */
       helpers$$camelize = function( str )  {
           return str && str.replace( helpers$$reDash, function(_, separator, letter, offset)  {
               return offset ? letter.toUpperCase() : letter;
           }).replace( helpers$$mozHack, "Moz$1" );
       },
   
    /**
     * http://www.w3.org/TR/DOM-Level-2-Style
     */
   
       helpers$$computeStyle = function( node )  {
           // Support: IE<=11+, Firefox<=30+
           // IE throws on elements created in popups
           // FF meanwhile throws on frame elements through 'defaultView.getComputedStyle'
           if ( node.ownerDocument.defaultView.opener ) {
               return ( node.ownerDocument.defaultView ||
                   // This will work if the ownerDocument is a shadow DOM element
                   DOCUMENT.defaultView ).getComputedStyle( node );
           }
           return WINDOW.getComputedStyle( node );
       },
   
       helpers$$injectElement = function( node )  {
           if ( node && node.nodeType === 1 ) return node.ownerDocument.head.appendChild( node );
       };

    /**
     * uClass - class system
     *
     * NOTE!! uClass is only for *internally* usage, and should
     * not be exposed to the global scope.
     *
     * uClass *only* purpose is to provide a faster
     * 'inheritance' solution for ugma then native 
     * javascript functions such Object.create() can do.
     *
     * For the global scope we have *ugma.extend()*
     * to make it easier for end-devs to create plugins.
     *
     */

    var core$core$$uClass = function()  {
    
        var len = arguments.length,
            mixin = arguments[ len - 1 ],
            SuperClass = len > 1 ? arguments[ 0 ] : null,
            Class, SuperClassEmpty,
            noop = function()  {},
            extend = function( obj, extension, overwrite )  {
    
                // failsave if something goes wrong
                if ( !obj || !extension) return obj || extension || {};
    
                helpers$$forOwn( extension, function( prop, func )  {
        
                    if ( overwrite === false ) {
                    
                       if ( !( prop in obj ) ) obj[ prop ] = func;
                    
                    } else {
                    
                        obj[ prop ] = func;
                    }
                });
        };
    
        if ( helpers$$is(mixin.constructor, "object") ) {
            Class = noop;
        } else {
            Class = mixin.constructor;
            delete mixin.constructor;
        }
    
        if (SuperClass) {
            SuperClassEmpty = noop;
            SuperClassEmpty.prototype = SuperClass.prototype;
            Class.prototype = new SuperClassEmpty();
            Class.prototype.constructor = Class;
            Class.Super = SuperClass;
    
            extend( Class, SuperClass, false );
        }
       
        extend( Class.prototype, mixin );
    
        return Class;
    },
    
      /**
       * dummyTree class
      */
    
    core$core$$dummyTree = core$core$$uClass({
        // dummy function - does nothing
            constructor: function() {},
            toString: function() { return "" }
        }),
    
        /**
         * nodeTree class
         */
        core$core$$nodeTree = core$core$$uClass( core$core$$dummyTree, {
            // Main constructor
            constructor: function(node) {
    
                if ( this ) {
    
                     this[ 0 ] = node;
                     this._ = {};  
      
                     node._ugma = this;
                   
                    return this;
                } 
    
              return node ? node._ugma || new core$core$$nodeTree( node ) : new core$core$$dummyTree();
           },
            toString: function() { return "<" + this[ 0 ].tagName.toLowerCase() + ">" }
        }),
    
        /**
         * domTree class
         */
        core$core$$domTree = core$core$$uClass( core$core$$nodeTree, {
            constructor: function(node) { return core$core$$domTree.Super.call( this, node.documentElement ) },
                toString: function() { return "#document" }
        }),
        
        /**
         * Internal method to extend ugma with methods - either 
         * the nodeTree or the domTree
         */
        core$core$$implement = function( obj, callback, mixin )  {
    
            if ( !callback ) callback = function( method, strategy )  {return strategy};
    
            helpers$$forOwn( obj, function( method, func )  {
                var args = [ method ].concat( func );
                (mixin ? core$core$$nodeTree : core$core$$domTree).prototype[ method ] = callback.apply( null, args );
    
                if ( mixin ) core$core$$dummyTree.prototype[ method ] = mixin.apply( null, args );
            });
        },
        
      /**
       * Internal 'instanceOf' method
       */
    
       // Double negation considered slower than a straight null check.   
       core$core$$instanceOf = function( node )  {return node.constructor && node._ != null};

    // Set a new document, and define a local copy of ugma

    var core$core$$ugma = new core$core$$domTree( DOCUMENT );

    /**
      * Extend ugma with methods
      * @param  {Object}    mixin       methods container
      * @param  {Boolean|Function} callback 
      * @example
      *
      * ugma.extend({
      *     foo: function() {
      *         console.log("bar");
      *     }
      * });  //  link.foo();
      *
      * ugma.extend({
      *     foo: function() {
      *         console.log("bar");
      *     }
      * }, true); // ugma.foo();
      *
      *
      * Note! The second argument - 'function' - extend the ugma.extend() with similar
      * options as for the *internally* implement method, and let us
      * return e.g. empty object ( {} ), array, booleans, array with values ( arr[1,2,3] )
      */

    core$core$$ugma.extend = function(mixin, callback)  {
        
          if( !helpers$$is( mixin, "object" )  || helpers$$isArray( mixin ) ) minErr$$minErr( "ugma.extend", "The first argument is not a object.");
          
          if(mixin) {
              
              // Extend ...
              if( callback && helpers$$is(callback, "boolean") ) return core$core$$implement( mixin );
              
               return core$core$$implement( mixin, null, !helpers$$is(callback, "function") ? function()  {return RETURN_THIS} : callback );
          }
          
          return false;        
      };

    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches

    /* es6-transpiler has-iterators:false, has-generators: false */

    var util$selectormatcher$$quickMatch = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,
        util$selectormatcher$$matchesMethod = helpers$$map(VENDOR_PREFIXES.concat( null ), function( p )  {
            return ( p ? p.toLowerCase() + "M" : "m" ) + "atchesSelector";
        }).reduceRight( function( propName, p )  {
            return propName ||
                // Support: Chrome 34+, Gecko 34+, Safari 7.1, IE10+ (unprefixed)
                ( HTML.matches && "matches" ||
                // Support: Chome <= 33, IE9, Opera 11.5+,  (prefixed)
                 p in HTML && p );
        }, null ),
        //
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
                if ( matches[ 1 ] ) matches[ 1 ] = matches[ 1 ].toLowerCase();
                if ( matches[ 3 ] ) matches[ 3 ] = matches[ 3 ].split( "=" );
                if ( matches[ 4 ] ) matches[ 4 ] = " " + matches[ 4 ] + " ";
            }
    
            return function( node ) {
                var result, found;
    
                for (; node && node.nodeType === 1; node = node.parentNode) {
                    if (matches) {
                        result = (
                            ( !matches[ 1 ] || node.nodeName.toLowerCase() === matches[ 1 ] ) &&
                            ( !matches[ 2 ] || node.id === matches[ 2 ] ) &&
                            ( !matches[ 3 ] || (matches[ 3 ][ 1 ] ? node.getAttribute( matches[ 3 ][ 0 ] ) === matches[ 3 ][ 1 ] : node.hasAttribute(matches[ 3 ][ 0 ] ) ) ) &&
                            ( !matches[ 4 ] || (" " + node.className + " ").indexOf( matches[ 4 ] ) >= 0 )
                        );
                    } else {
                        result = util$selectormatcher$$matchesMethod ? node[ util$selectormatcher$$matchesMethod ]( selector ) : util$selectormatcher$$query( node, selector );
                    }
    
                    if (result || !context || node === context) break;
                }
    
                return result && node;
            };
        }
        return null;
    };

    core$core$$implement({
        /**
         * Returns all child nodes in a collection of children filtered by optional selector
         * @param  {String} [selector] css selector
         * @chainable
         * @example
         *     link.children();
         *     link.children('.filter');
         */
        children: true,
        /**
         * Returns the first child node in a collection of children filtered by index
         * @param  {Number} index child index
         * @chainable
         * @example
         *   ul.child(0);  // => the first <li>
         *   ul.child(2);  // => 3th child <li>
         *   ul.child(-1); // => last child <li>     
         */
        child: false
    
    }, function( methodName, all )  {return function( selector ) {
        if (selector && ( !helpers$$is( selector, all ? "string" : "number" ) ) ) {
            minErr$$minErr( methodName + "()", selector + " is not a " + ( all ? " string" : " number" ) + " value" );
        }
    
        var node = this[ 0 ],
            matcher = util$selectormatcher$$default( selector ),
            children = node.children;
    
        if ( all ) {
            if ( matcher ) children = helpers$$filter( children, matcher );
    
            return helpers$$map(children, core$core$$nodeTree);
        } 
            // Avoid negative children, normalize to 0
        if ( selector < 0 ) selector = children.length + selector;
    
           return core$core$$nodeTree( children[ selector ] );
        
    }}, function( methodName, all )  {return function()  {return all ? [] : new core$core$$dummyTree()}} );

    /* es6-transpiler has-iterators:false, has-generators: false */

    var modules$classes$$reClass = /[\n\t\r]/g;

    core$core$$implement({
       
       /**
        * Adds a class(es) or an array of class names
        * @param  {...String} classNames class name(s)
        * @chainable
        * @example
        * 
        *      <div id="foo" class="apple fruit"></div>
        *
        *      ugma.query('#foo')[0].className;
        *      // -> 'apple fruit'
        *
        *      ugma.query('#foo').addClass('food');
        *
        *      ugma.query('#foo')[0].className;
        *      // -> 'apple fruit food'
        */
        addClass: [ "add", true, function( node, token )  {
            var existingClasses = ( " " + node[ 0 ].className + " " ).replace( modules$classes$$reClass, " " );
    
            if ( existingClasses.indexOf( " " + token + " " ) === -1 ) {
                existingClasses += token + " ";
            }
    
            node[ 0 ].className = helpers$$trim(existingClasses);
        }],
       /**
        * Remove class(es) or an array of class names from element
        * @param  {...String} classNames class name(s)
        * @chainable
        * @example
        * 
        *      <div id="foo" class="apple fruit food"></div>
        *  
        *      ugma.query('#foo').removeClass('food');
        *      // -> Element
        *      
        *      ugma.query('#foo')[0].className;
        *      // -> 'apple fruit'
        */
        removeClass: [ "remove", true, function( node, token )  {
            node[ 0 ].className = (" " + node[ 0 ].className + " ")
                .replace(modules$classes$$reClass, " ").replace(" " + token + " ", " ");
        }],
       /**
        * Check if element contains class name
        * @param  {...String} classNames class name(s)
        * @chainable
        * @example
        *  
        *      <div id="foo" class="apple fruit food"></div>
        *
        *
        *      ugma.query('#foo').hasClass('fruit');
        *      // -> true
        *      
        *      ugma.query('#foo').hasClass('vegetable');
        *      // -> false    
        */
        hasClass: [ "contains", false, function( node, token )  {
            if ( (" " + node[ 0 ].className + " " ).replace( modules$classes$$reClass, " " ).indexOf( " " + token + " " ) > -1 ) return true;
            
            return false;
        }],
       /**
        * Toggle the `class` in the class list. Optionally force state via `condition`
        * @param  {...String} classNames class name(s)
        * @chainable
        * @example
        * 
        *      <div id="foo" class="apple"></div>
        *
        *      ugma.query('#foo').hasClass('fruit');
        *      // -> false
        *      
        *      ugma.query('#foo').toggleClass('fruit');
        *      // -> true
        *      
        *      ugma.query('#foo').hasClass('fruit');
        *      // -> true
        *  
        *      ugma.query('#foo').toggleClass('fruit', true);
        *      // -> true
        */    
        toggleClass: ["toggle", false, function( el, token )  {
            var hasClass = el.hasClass( token );
           
             if(hasClass) {
                 el.removeClass( token ); 
             } else {
                el.addClass( token ); 
             }
    
            return !hasClass;
        }]
    }, function( methodName, nativeMethodName, iteration, strategy )  {
    
        if ( HTML.classList ) {
            // use native classList property if possible
            strategy = function( el, token )  {
                return el[ 0 ].classList[ nativeMethodName ]( token );
            };
        }
    
        if ( !iteration ) {
    
            return function( token, stateVal ) {
               
                if ( helpers$$is( stateVal, "boolean") && nativeMethodName === "toggle" ) {
                    this[ stateVal ? "addClass" : "removeClass" ]( token );
    
                    return stateVal;
                }
    
                if ( !helpers$$is( token, "string" ) ) minErr$$minErr( nativeMethodName + "()", "The class provided is not a string." );
    
                return strategy( this, token );
            };
        } else {
    
            return function() {
                    
                    for (var i = 0, len = arguments.length; i < len; i++) {    
                    
                    if ( !helpers$$is(arguments[ i ], "string" ) ) minErr$$minErr( nativeMethodName + "()", "The class provided is not a string." );
    
                    strategy( this, arguments[ i ] );
                }
                return this;
            };
        }
     }, function( methodName, defaultStrategy )  {
    
          if( defaultStrategy === "contains" || defaultStrategy === "toggle" ) return RETURN_FALSE;
          
          return RETURN_THIS;
      });

    core$core$$implement({
        /**
         * Clear a property/attribute on the node
         * @param  {String}   name    property/attribute name
         * @example 
         *
         *   <a id='test' href='#'>set-test</a><input id='set_input'/><input id='set_input1'/><form id='form' action='formaction'>
         *
         *      ugma.query("#test").has("checked");
         *      // false
         *
         *      ugma.query("#test").set("checked", "checked");
         *
         *      ugma.query("#test").has("checked");
         *      // true
         *
         *     ugma.query("#test").clear("checked");
         *
         *     ugma.query("#test").has("checked");
         *     // false
         */
        clear: function(name) { return this.set(name, null) }
    
    }, null, function()  {return RETURN_THIS});

    // Reference: https://dom.spec.whatwg.org/#dom-node-clonenode

    core$core$$implement({
      /**
       * Returns a copy of a DOM node.
       * @param {Boolean} [deep=true] true if all descendants should also be cloned, or false otherwise
       * @chainable
       * @example
       *
       *      <div class="original">
       *        <div class="original_child"></div>
       *      </div>
       *  
       *      var clone = ugma.query('.original').clone(false);
       *      clone[0].className;
       *      // -> "original"
       *      clone[0].children;
       *      // -> HTMLCollection[]
       *  
       *      var deepClone = ugma.query('original').clone(true);
       *      deepClone[0].className;
       *      // -> "original"
       *
       *      deepClone[0].children;
       *      // -> HTMLCollection[div.original_child]
       */
        clone: function(deep) {
            
            if ( !helpers$$is( deep, "boolean" ) ) minErr$$minErr( "clone()", "This element can not be cloned." );
            
            return new core$core$$nodeTree( this[ 0 ].cloneNode( deep) );
        }
    }, null, function()  {return function()  {return new core$core$$dummyTree()}} );

    // Reference: https://dom.spec.whatwg.org/#dom-element-closest 

    core$core$$implement({
     /**
      * Return the closest element matching the selector
      * @param {String} [selector] css selector
      * @Following the Element#closest specs  
      * @chainable
      * @example
      *
      *        <body>
      *          <div id="father">
      *            <div id="kid">
      *            </div>
      *          </div>
      *        </body>
      *      </html>
      *
      *   ugma.query('#kid').closest()
      *
      *      // -> [div#father]
      */
        closest: function(selector) {
            if ( selector && !helpers$$is( selector, "string" ) ) minErr$$minErr( "closest()", "The string did not match the expected pattern" );
    
            var matches = util$selectormatcher$$default( selector ),
                parentNode = this[ 0 ];
            
            // document has no .matches
            if ( !matches ) parentNode = parentNode.parentElement;
    
            for (; parentNode; parentNode = parentNode.parentElement )
               if (parentNode.nodeType === 1 && ( !matches || matches( parentNode ) ) ) break;
    
            return core$core$$nodeTree( parentNode );
        }
    }, null, function()  {return function()  {return new core$core$$dummyTree()}} );

    core$core$$implement({
     /**
      * Check if element is inside of context
      * @param  {ugma wrapped Object} element to check
      * @return {Boolean} returns true if success and false otherwise
      *
      * @example
      *   ugma.contains(childElement);
      *     // true/false
      *
      * Note! 
      *
      * The contains(other) method returns true if other is an inclusive descendant of the 
      * context object, and false otherwise (including when other is null).
      *
      * @reference: https://dom.spec.whatwg.org/#dom-node-contains 
      */
        contains: function(other) {
    
            var reference = this[ 0 ];
    
            if ( core$core$$instanceOf(other) ) {
    
                 other = other[ 0 ];
    
                // If other and reference are the same object, return zero.
                if ( reference === other ) return 0;
    
                return reference.contains(other);
            }
    
            minErr$$minErr( "contains()", "Comparing position against non-Node values is not allowed." );
        }
    }, null, function()  {return RETURN_FALSE});

    core$core$$implement({
        /**
         * Read or write inner content of the element
         * @param  {Mixed}  [content]  optional value to set
         * @chainable
         * @example
         *     link.content('New value');
         *
         *     var div = ugma.render("div>a+b");
         *     div.value(ugma.render("i"));
         */
         content: function(val) {
      
           if ( arguments.length === 0 ) return this.get();
    
           if ( core$core$$instanceOf( val ) || helpers$$isArray( val ) ) return this.set( "" ).append( val );
    
           return this.set( val );
        }
    }, null, function()  {return function() {
        
        if ( arguments.length ) return this;
        
    }});




    var util$styleAccessor$$UnitlessNumber = ("box-flex box-flex-group column-count flex flex-grow flex-shrink order orphans " +
        "color richness volume counter-increment float reflect stop-opacity float scale backface-visibility " +
        "fill-opacity font-weight line-height opacity orphans widows z-index zoom column-rule-color perspective alpha " +
        "overflow rotate3d border-right-color border-top-color text-decoration-color text-emphasis-color " +
        // SVG-related properties
        "stop-opacity stroke-mitrelimit stroke-dash-offset, stroke-width, stroke-opacity fill-opacity").split(" "),
        
        util$styleAccessor$$styleAccessor = { get: {}, set: {} },
        util$styleAccessor$$directions = ["Top", "Right", "Bottom", "Left"],
        util$styleAccessor$$shortHand = {
            font:           ["fontStyle", "fontSize", "/", "lineHeight", "fontFamily"],
            borderRadius:   ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
            padding:        helpers$$map( util$styleAccessor$$directions, function( dir )  {return "padding" + dir} ),
            margin:         helpers$$map( util$styleAccessor$$directions, function( dir )  {return "margin" + dir} ),
            "border-width": helpers$$map( util$styleAccessor$$directions, function( dir )  {return "border" + dir + "Width"} ),
            "border-style": helpers$$map( util$styleAccessor$$directions, function( dir )  {return "border" + dir + "Style"} )
        };

    // Don't automatically add 'px' to these possibly-unitless properties
    helpers$$each(util$styleAccessor$$UnitlessNumber, function( propName )  {
        var stylePropName = helpers$$camelize(propName);
    
        util$styleAccessor$$styleAccessor.get[ propName ] = stylePropName;
        util$styleAccessor$$styleAccessor.set[ propName ] = function( value, style )  {
            style[stylePropName] = value + "";
        };
    });

    // normalize property shortcuts
    helpers$$forOwn(util$styleAccessor$$shortHand, function(key, props)  {
    
        util$styleAccessor$$styleAccessor.get[ key ] = function(style)  {
            var result = [],
                hasEmptyStyleValue = function(prop, index)  {
                    result.push(prop === "/" ? prop : style[ prop ]);
    
                    return !result[index];
                };
    
            return props.some(hasEmptyStyleValue) ? "" : result.join(" ");
        };
    
        util$styleAccessor$$styleAccessor.set[ key ] = function(value, style)  {
            if (value && "cssText" in style) {
                // normalize setting complex property across browsers
                style.cssText += ";" + key + ":" + value;
            } else {
                helpers$$each( props, function(name)  {return style[ name ] = typeof value === "number" ? value + "px" : value + ""} );
            }
        };
    });

    util$styleAccessor$$styleAccessor._default = function(name, style) {
        var propName = helpers$$camelize( name );
    
        if (!(propName in style)) {
            propName = helpers$$filter( helpers$$map(VENDOR_PREFIXES, function( prefix )  {return prefix + propName[ 0 ].toUpperCase() + propName.slice( 1 )}), function( prop )  {return prop in style})[ 0 ];
        }
    
        return this.get[ name ] = this.set[ name ] = propName;
    };

    /**
     * Hook 'styleAccessor' on ugma namespace
     */

    core$core$$ugma.styleAccessor = function( mixin, where )  {
       // Stop here if 'where' is not a typeof string
        if( !helpers$$is( where, "string" ) ) minErr$$minErr( "ugma.styleAccessor()", "Not a valid string value" );
      
        if ( helpers$$is( mixin, "object" ) && !helpers$$isArray( mixin ) ) {
  
            helpers$$forOwn( mixin, function( key, value )  {
                if( helpers$$is( value, "string" ) || helpers$$is( value, "function" ) ) util$styleAccessor$$styleAccessor[ where ][ key ] = mixin;
            });
        }
    };

    var util$styleAccessor$$default = util$styleAccessor$$styleAccessor;
    function util$adjustCSS$$adjustCSS( root, prop, parts, computed ) {
    
        var adjusted,
            scale = 1,
            maxIterations = 20,
            currentValue = function() {
                return parseFloat( computed[ prop ] );
            },
            initial = currentValue(),
            unit = parts && parts[ 3 ] || "",
            // Starting value computation is required for potential unit mismatches
            initialInUnit = ( unit !== "px" && +initial ) && RCSSNUM.exec( computed[ prop ] );
    
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
    
        if ( parts ) {
            // Apply relative offset (+=/-=) if specified
            adjusted = parts[ 1 ] ? ( +initialInUnit || +initial || 0 ) + ( parts[ 1 ] + 1 ) * parts[ 2 ] : +parts[ 2 ];
    
            return adjusted;
        }
    }

    core$core$$implement({
      /**
        * Get the value of a style property for the DOM Node, or set one or more style properties for a DOM Node.
        * @param  {String|Object}      name    style property name or key/value object
        * @param  {String|Function}    [value] style property value or functor
        * @chainable
        * @example
        *
        * // #Getter
        *
        *    link.css('fontSize');
        *    // -> '12px'
        *
        *  // #Setter
        *
        *     link.css({
        *        cssFloat: 'left',
        *        opacity: 0.5
        *      });
        *      // -> Element
        *      
        *      link.css({
        *        'float': 'left', // notice how float is surrounded by single quotes
        *        opacity: 0.5
        *      });
        *      // -> Element
        *  
        */
        
        css: function(name, value) {var this$0 = this;
            
            var len = arguments.length,
                node = this[ 0 ],
                style = node.style,
                computed;
   
            // Get CSS values with support for pseudo-elements
            if ( len === 1 && ( helpers$$is( name, "string" ) || helpers$$isArray( name ) ) ) {
                
                var getValue = function( name )  {
                    var getter = util$styleAccessor$$default.get[ name ] || util$styleAccessor$$default._default( name, style ),
                        // Try inline styles first
                        value = helpers$$is( getter, "function" ) ? getter( style ) : style[ getter ];
   
                    if ( !value || value === "auto" ) {
                        // Reluctantly retrieve the computed style.
                        if ( !computed ) computed = helpers$$computeStyle(node, "" );
   
                        value = helpers$$is( getter, "function" ) ? getter( computed ) : computed[ getter ];
                    }
   
                    return value;
                };
   
                if ( helpers$$is( name, "string" ) ) return getValue( name );
   
                    var obj = {};
                     helpers$$each( helpers$$map( name, getValue ), function( value, index )  {
                        obj[ name [ index ] ] = value;
                    } );
                  return obj;
            }
   
            if ( len === 2 && helpers$$is( name, "string" ) ) {
             
                var ret, setter = util$styleAccessor$$default.set[ name ] || util$styleAccessor$$default._default( name, style );
   
                if ( helpers$$is( value, "function" ) ) value = value( this );
   
                if ( value == null || helpers$$is( value, "boolean" ) ) value = "";
   
                // Convert '+=' or '-=' to relative numbers
                if ( value !== "" && ( ret = RCSSNUM.exec( value ) ) && ret[ 1 ] ) {
   
                    value = util$adjustCSS$$adjustCSS( this, setter, ret, computed || helpers$$computeStyle(node));
   
                    if ( ret && ret[ 3 ] ) value += ret[ 3 ];
                }
   
                if ( helpers$$is( setter, "function" ) ) {
                    setter ( value, style );
                } else {
                    style[ setter ] = helpers$$is( value, "number" ) ? value + "px" : "" + value; // cast to string 
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
        
        var len = arguments.length;
        
        if ( len === 1 && helpers$$isArray( name ) ) return {};
   
        if ( len !== 1 || !helpers$$is( name, "string" ) ) return this;
    }});

    var util$readData$$multiDash = /([A-Z])/g,
        // Read the specified attribute from the equivalent HTML5 `data-*` attribute,
        util$readData$$readData = function( node, value )  {
    
        // convert from camel case to dash-separated value
        value = value.replace( util$readData$$multiDash, "-$&" ).toLowerCase();
    
        value = node.getAttribute( value );
    
        if ( value != null ) {
    
            // object notation syntax should have JSON.stringify form
            if ( value[ 0 ] === "{" && value[ value.length - 1 ] === "}" ) {
                try {
                    value = JSON.parse( value );
                } catch ( err ) {}
            }
        }
    
        return value;
    };

    core$core$$implement({
      /**
       * Get / set a key/value pair of custom metadata on the element. Tries to read the appropriate
       * HTML5 data-* attribute if it exists
       * @param  {String|Object|Array}  key(s)  data key or key/value object or array of keys
       * @param  {Object}               [value] data value to store
       * @return {Object} data entry value or this in case of setter
       * @chainable
       * @example
       *     link.data('foo'); // get
       *     link.data('bar', {any: 'data'}); // set
       */   
        data: function(key, value) {var this$0 = this;
            
            var len = arguments.length;
            
            // getter
            if ( len === 1 ) {
                if ( helpers$$is( key, "string" ) ) {
    
                    var data = this._;
                    // If no data was found internally, try to fetch any
                    // data from the HTML5 data-* attribute
                    if ( !( key in data ) ) data[ key ] = util$readData$$readData( this[ 0 ], "data-" + key );
    
                    return data && data[ key ]; // data('key')
                    
                // Set the value (with attr map support)
                } else if ( key && helpers$$is( key, "object" ) ) {
                 
                    if ( helpers$$isArray( key ) ) return this.data( helpers$$map(key, function( key )  {return key} ) );
                      // mass-setter: data({key1: val1, key2: val2})
                      return helpers$$forOwn( key, function( key, value )  {
                            this$0.data( key, value );
                       });
                }
            } 
             // setter   
            if ( len === 2 ) {
                // delete the private property if the value is 'null' or 'undefined'
                if ( value === null || value === undefined ) {
                    delete this._[ key ];
                } else {
                    this._[ key ] = value; // data('key', value)
                }
            }
            return this;
        }
    }, null, function()  {return RETURN_THIS} );

    core$core$$implement({
      /**
        * Remove child nodes of current element from the DOM
        * @chainable
        * @example
        *
        *    link.empty();
        */
        empty: function() { return this.set( "" ) }
    }, null, function()  {return RETURN_THIS} );

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

    // Receive specific events at 60fps, with requestAnimationFrame (rAF).
    // http://www.html5rocks.com/en/tutorials/speed/animations/
    function util$debounce$$debounce( handler, node ) {
        var debouncing;
        return function( e )  {
            if ( !debouncing ) {
                debouncing = true;
                node._.raf = util$raf$$requestFrame( function()  {
                    handler( e );
                    debouncing = false;
                });
            }
        };
    }

    var util$eventhooks$$eventHooks = {};

    // Special events for the frame events 'hook'
    helpers$$each(("touchmove mousewheel scroll mousemove drag").split(" "), function( name )  {
        util$eventhooks$$eventHooks[ name ] = util$debounce$$debounce;
    });

    // Support: Firefox, Chrome, Safari
    // Create 'bubbling' focus and blur events

    if ("onfocusin" in DOCUMENT.documentElement) {
        util$eventhooks$$eventHooks.focus = function( handler )  { handler._eventType = "focusin"  };
        util$eventhooks$$eventHooks.blur = function( handler )   { handler._eventType = "focusout" };
    } else {
        // firefox doesn't support focusin/focusout events
        util$eventhooks$$eventHooks.focus = util$eventhooks$$eventHooks.blur = function( handler )  { handler.capturing = true };
    }

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
        DOCUMENT.attachEvent( "onselectionchange", function()  {
            if ( util$eventhooks$$capturedNode && util$eventhooks$$capturedNode.value !== util$eventhooks$$capturedNodeValue ) {
                util$eventhooks$$capturedNodeValue = util$eventhooks$$capturedNode.value;
                // trigger custom event that capture
                core$core$$ugma.native( util$eventhooks$$capturedNode ).trigger( "input" );
            }
        });
    
        // input event fix via propertychange
        DOCUMENT.attachEvent( "onfocusin", function()  {
            util$eventhooks$$capturedNode = WINDOW.event.srcElement;
            util$eventhooks$$capturedNodeValue = util$eventhooks$$capturedNode.value;
        });
    }

    /**
     * Hook 'eventHooks' on ugma namespace
     */

    core$core$$ugma.eventHooks = function( mixin )  {
      
        if ( helpers$$is( mixin, "object" ) && !helpers$$isArray( mixin ) ) {
  
            helpers$$forOwn( mixin, function( key, value )  {
                if( helpers$$is( value, "string" ) || helpers$$is( value, "function" ) )
                util$eventhooks$$eventHooks[ key ] = mixin;
            });
        }
    };

    var util$eventhooks$$default = util$eventhooks$$eventHooks;

    var util$eventhandler$$getEventProperty = function(name, e, eventType, node, target, currentTarget)  {
    
        if ( helpers$$is( name, "number" ) )  return e._fire ? e._fire[ name ] : void 0;
        
        switch( name ) {
         case "type":              return eventType;
         case "target":            return core$core$$nodeTree( target );
         case "currentTarget":     return core$core$$nodeTree( currentTarget );
         case "relatedTarget":     return core$core$$nodeTree( e.relatedTarget );  
        }
    
        var value = e[ name ];
    
        if ( helpers$$is( value, "function" ) ) return function()  {return value.apply( e, arguments )};
    
        return value;
    },
     util$eventhandler$$EventHandler = function( el, eventType, selector, callback, props, once )  {
    
        var node = el[ 0 ],
            hook = util$eventhooks$$default[ eventType ],
            matcher = util$selectormatcher$$default( selector, node ),
            handler = function( e )  {
               
                e = e || WINDOW.event;
                
                // early stop in case of default action
                if ( util$eventhandler$$EventHandler.veto === eventType ) return;
    
                // http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Registration-interfaces
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
                    args = helpers$$map( args, function( name )  {return util$eventhandler$$getEventProperty( name, e, eventType, node, eventTarget, currentTarget )} );
                } else {
                    args = helpers$$slice.call( e._fire || [ 0 ], 1 );
                }
    
                // prevent default if handler returns false
                if ( callback.apply( el, args ) === false ) {
                    e.preventDefault();
                }
            };
    
        if ( hook ) handler = hook( handler, el ) || handler;
    
        handler.eventType  = eventType;
        handler.callback   = callback;
        handler.selector   = selector;
    
        return handler;
    };

    var util$eventhandler$$default = util$eventhandler$$EventHandler;

    core$core$$implement({
        
       /**
        * Bind an event to a callback function for one or more events to the selected elements. 
        * @param  {String|Array}  type        event type(s) with optional selector
        * @param  {String}        [selector]  event selector filter
        * @param  {Array}         [args]      array of handler arguments to pass into the callback
        * @param  {Function}      callback    event callback
        * @chainable
        * @example
        *    
        *      ugma.query("#foo").on("click", function() {
        *        // ...
        *      });
        *    
        *      ugma.query("#foo").on(['click', 'focus'], '.item', function() {
        *        // ...
        *      });
        *    
        *      ugma.query("#foo").on("click", "a.comment", function() {
        *        // ...
        *      });
        *    
        *      ugma.query("#foo").on("click", ['target', 'keyCode'], function(target, keyCode) {
        *        // ...
        *      });
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
    
            if ( helpers$$is( selector, "function" ) ) {
                callback = selector;
                selector = null;
                args = null;
            }
    
            if ( !helpers$$is( callback, "function" ) )  minErr$$minErr( method + "()", callback + " is not a function." );
    
            // http://jsperf.com/string-indexof-vs-split
            var node = this[ 0 ],
                parts,
                eventTypes = helpers$$inArray( eventType, " " ) >= -1 ? eventType.split( " " ) : [ eventType ],
                i = eventTypes.length,
                handler,
                handlers = this._.handlers || ( this._.handlers = [] );
    
                handler = util$eventhandler$$default( this, eventType, selector, callback, args, single );
    
                node.addEventListener( handler._eventType || eventType, handler, !!handler.capturing );
    
                  // store the event handler
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


    core$core$$implement({
    
       /**
        * Remove one or many callbacks.
        * @param  {String}          type        type of event
        * @param  {String}          [selector]  event selector
        * @param  {Function|String} [callback] event handler
        * @chainable
        * @example
        *    
        *      ugma.query("#foo").off();
        *    
        *      ugma.query("#foo").off("click", function() {
        *        // ...
        *      });
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
                handlers,
                removeHandler = function( handler )  {
    
                    // Cancel previous frame if it exists
                    if ( self._._raf ) {
                          util$raf$$cancelFrame( self._.raf );
                        // Zero out rAF id used during the animation
                        self._._raf = null;
                    }
                    // Remove the listener
                    node.removeEventListener( ( handler._eventType || handler.eventType ), handler, !!handler.capturing );
                };
    
            this._.handlers = helpers$$filter(this._.handlers, function( handler )  {
    
                var skip = eventType !== handler.eventType;
    
                skip = skip || selector && selector !== handler.selector;
                skip = skip || callback && callback !== handler.callback;
    
                // Bail out if listener isn't listening.
                if ( skip ) return true;
    
                removeHandler( handler );
            });
    
            return this;
        }
    }, null, function()  {return RETURN_THIS} );

    core$core$$implement({
       
       /**
        * Trigger one or many events, firing all bound callbacks. 
        * @param  {String}  type  type of event
        * @param  {...Object}     [args]  extra arguments to pass into each event handler
        * @return {Boolean} true if default action wasn't prevented
        * @chainable
        * @example
        *    link.fire('anyEventType');
        */
        fire: function(type) {
        var node = this[ 0 ],
            e, eventType, canContinue;
    
        if ( helpers$$is( type, "string" ) ) {
            var hook = util$eventhooks$$default[ type ],
                handler = {};
    
            if ( hook ) handler = hook( handler ) || handler;
    
            eventType = handler._eventType || type;
        } else {
            minErr$$minErr( "fire()", "The string did not match the expected pattern" );
        }
        // Handles triggering the appropriate event callbacks.
        e = node.ownerDocument.createEvent( "HTMLEvents" );
        e._fire = arguments;
        e.initEvent( eventType, true, true );
        canContinue = node.dispatchEvent( e );
    
        // call native function to trigger default behavior
        if ( canContinue && node[ type ] ) {
            // prevent re-triggering of the current event
            util$eventhandler$$default.veto = type;
    
            helpers$$invoke( node, type );
    
            util$eventhandler$$default.veto = null;
        }
    
        return canContinue;
      }
    }, null, function()  {return RETURN_TRUE} );

    var util$support$$support = {};

    /**
      Expose 'support' to the ugma namespace
    */

    core$core$$ugma.support = util$support$$support;


    var util$support$$default = util$support$$support;

    var util$accessorhooks$$langFix = /_/g,
        util$accessorhooks$$accessorHooks = {
            // getter
            get: {
                // special case - setting a style
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
                    if ( node.type === "checkbox" && !util$support$$default.checkOn ) {
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
            // setter
            set: {
                // correct locale browser language before setting the attribute             
                // e.g. from zh_CN to zh-cn, from en_US to en-us
                lang:  function( node, value )  { node.setAttribute( "lang", value.replace( util$accessorhooks$$langFix, "-" ).toLowerCase() ) },
                style: function( node, value )  { node.style.cssText = value },
                title: function( node, value )  {
                    var doc = node.ownerDocument;
    
                    ( node === doc.documentElement ? doc : node ).title = value;
                },
                value: function( node, value )  {
    
                    if ( node.tagName === "SELECT" ) {
                        // selectbox has special case
                        if ( helpers$$every.call(node.options, function( o )  {return !( o.selected = o.value === value )} ) ) node.selectedIndex = -1;
    
                    } else {
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
         util$support$$default.checkOn = input.value !== "";
    
        // Support: IE<=11+
        // Must access selectedIndex to make default options select
         util$support$$default.optSelected = opt.selected;
    
        // Support: IE<=11+
        // An input loses its value after becoming a radio
        input.type = "radio";
        input.value = "t";
        util$support$$default.radioValue = input.value === "t";
    })();

    // Support: IE<=11+
    if ( !util$support$$default.radioValue ) {
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

    if ( !util$support$$default.optSelected ) {
        util$accessorhooks$$accessorHooks.get.selected = function( node )  {
            var parent = node.parentNode;
            /* jshint ignore:start */
            if ( parent && parent.parentNode ) parent.parentNode.selectedIndex;
            /* jshint ignore:end */
            return null;
        };
    }

    /**
     * Properties written as camelCase
     *
     * https://html.spec.whatwg.org/multipage/forms.html
     */

    helpers$$each((
       // 6.4.3 The tabindex attribute
        ("readOnly "         +   // Whether to allow the value to be edited by the user
        "tabIndex "         +
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
        "noValidate "       +
        "acceptCharset "    +
        "accessKey "        +
        "encType "          +
        "vAlign  "          +
        "formAction "       +  // URL to use for form submission
        "formMethod "       +  // HTTP method to use for form submission
        "formNoValidate "   +  // Bypass form control validation for form submission 
        "formTarget "       +  // Browsing context for form submission
        "inputMode "        +  // Hint for selecting an input modality
        "maxLength "        +  // Maximum length of value
        "minLength "        +  // Minimum length of value
        "defaultValue "     +
        "valueAsDate "      +
        "valueLow "         +
        "valueHeight "      +
        "willValidate "     +
        "checkValidity "    +  // Returns true if the form's controls are all valid; otherwise, returns false.
        "reportValidity "   +  // Returns true if the form's controls are all valid; otherwise, returns false and informs the user.
        "selectionStart "   +
        "selectionEnd " + "longDesc") ).split( " " ), function( key )   {
        util$accessorhooks$$accessorHooks.get[ key.toLowerCase() ] = function( node )  {return node[ key ]};
    });

    /**
     * Hook 'accessorHooks' on the ugma namespace
     */

    core$core$$ugma.accessorHooks = function( mixin, where )  {
       // Stop here if 'where' is not a typeof string
        if( !helpers$$is( where, "string" ) ) minErr$$minErr( "ugma.accessorHooks()", "Not a valid string value" );
      
        if ( helpers$$is( mixin, "object" ) && !helpers$$isArray( mixin ) ) {
  
            helpers$$forOwn( mixin, function( key, value )  {
                if( helpers$$is( value, "string" ) || helpers$$is( value, "function" ) ) util$accessorhooks$$accessorHooks[ where ][ key ] = mixin;
            });
        }
    };

    var util$accessorhooks$$default = util$accessorhooks$$accessorHooks;

    core$core$$implement({
       
      /**
       * Get HTML5 Custom Data Attributes, property or attribute value by name
       * @param  {String|Array}  name  property or attribute name or array of names
       * @return {String|Object} a value of property or attribute
       * @chainable
       * @example
       *
       *   <a id="tag" href="/tags/prototype" rel="tag" title="view related bookmarks." my_widget="some info.">Hatami</a>
       *
       *      ugma.query('#tag').get('href');
       *      // -> '/tags/prototype'
       *
       *      ugma.query('#tag').get('title');
       *      // -> 'view related bookmarks.'
       *
       *      ugma.query('#tag').get('my_widget');
       *      // -> 'some info.'
       *
       * @other examples
       *
       *    link.get('attrName');              // get
       *    link.get("data-a1");               // get data-* attribute
       *    link.get("outerHTML");             // get 'outerHTML'
       *    link.get("textContent");           // get 'textContent'
       */
       
        get: function(name) {var this$0 = this;
            var node = this[ 0 ],
                hook = util$accessorhooks$$default.get[ name ];
    
            // Grab necessary hook if it is defined
            if ( hook ) return hook(node, name);
    
            if ( helpers$$is(name, "string") ) {
                
                // if no DOM object property method is present... 
                if (name in node) return node[ name ];
                
               return /^data-/.test( name ) ? 
                   // try to fetch HTML5 `data-*` attribute      
                      util$readData$$readData( node, name ) : 
                    //... fallback to the getAttribute method, or return null
                      node.getAttribute( name ) || null;
    
            } else if ( helpers$$isArray( name ) ) {
                var obj = {};
                helpers$$each( name, function( key )  {
                    obj[ key ] = this$0.get( key );
                });
    
                return obj;
            } else {
                minErr$$minErr("get()", "This operation is not supported" );
            }
        }
    }, null, function()  {return function()  {}});

    core$core$$implement({
      /**
       * Returns true if the requested attribute/property is specified on the given element, and false otherwise.
       * @param  {String} [name] property/attribute name or array of names
       * @return {Boolean} true if exist
       * @chainable
       * @example
       *
       *   <a id='test' href='#'>set-test</a><input id='set_input'/><input id='set_input1'/><form id='form' action='formaction'>
       *
       *      ugma.query("#test").has("checked");
       *      // false
       *
       *      ugma.query("#test").set("checked", "checked");
       *
       *      ugma.query("#test").has("checked");
       *      // true
       */
       has: function(name) {
            if ( !helpers$$is( name, "string" ) ) minErr$$minErr( "has()", "Not a valid property/attribute" );
            
            return !!this[ 0 ][ name ] || this[ 0 ].hasAttribute( name ); // Boolean
        }
    }, null, function()  {return RETURN_FALSE} );

    core$core$$implement({
      /**
       * Append global css styles
       * @param {String}         selector  css selector
       * @param {String}  cssText   css rules
       */
        injectCSS: function(selector, cssText) {
            var styleSheet = this._._styles;
    
            if ( !styleSheet ) {
                var doc = this[ 0 ].ownerDocument,
                    styleNode = helpers$$injectElement( doc.createElement( "style" ) );
    
                styleSheet = styleNode.sheet || styleNode.styleSheet;
                // store object internally
                this._._styles = styleSheet;
            }
    
            if ( !helpers$$is( selector, "string" ) || !helpers$$is( cssText, "string" ) ) minErr$$minErr( "injectCSS()", "The string did not match the expected pattern" );
    
            helpers$$each( selector.split( "," ), function( selector ) {
                try {
                   styleSheet.insertRule(selector + "{" + cssText + "}", styleSheet.cssRules.length );
                } catch( err ) {}
            });
        }
    });

    core$core$$implement({
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
    
                    if ( helpers$$is( arg, "string" ) ) {
    
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

    core$core$$implement({
        
       /**
        *  Append HTMLString, native DOM element or a ugma wrapped object to the current element
        *
        * @param {Mixed} content HTMLString, nodeTree, native DOM element or functor that returns content
        * @return {Object} The wrapped collection
        * @chainable
        * @example
        *     link.append('<p>more</p>');
        *     link.append(ugma.render("b"));
        */
        append: [ "beforeend", true, false, function( node, relatedNode )  {
            node.appendChild( relatedNode );
        }],
       /**
        * Prepend  HTMLString, native DOM element or a ugma wrapped object to the current element
        *
        * @param {Mixed} content HTMLString, nodeTree, native DOM element or functor that returns content
        * @return {Object} The wrapped collection
        * @chainable
        * @example
        *     link.prepend('<span>start</span>');
        */    
        prepend: [ "afterbegin", true, false, function( node, relatedNode )  {
            node.insertBefore( relatedNode, node.firstChild );
        }],
       /**
        * Insert  HTMLString, native DOM element or a ugma wrapped object before the current element
        *
        * @param {Mixed} content HTMLString, nodeTree, native DOM element or functor that returns content
        * @return {Object} The wrapped collection
        * @chainable
        * @example
        *     link.before('<p>prefix</p>');
        *     link.before(ugma.render("i"), ugma.render("u"));
        */    
        before: [ "beforebegin", true, true, function( node, relatedNode )  {
            node.parentNode.insertBefore( relatedNode, node );
        }],
       /**
        * Insert HTMLString, native DOM element or a ugma wrapped object after the current element
        *
        * @param {Mixed} content HTMLString, nodeTree, native DOM element or functor that returns content
        * @return {Object} The wrapped collection
        * @chainable
        * @example
        *     link.after('<span>suf</span><span>fix</span>');
        *     link.after(ugma.render("b"));   
        */    
        after: [ "afterend", true, true, function( node, relatedNode )  {
            node.parentNode.insertBefore( relatedNode, node.nextSibling );
        }],
       /**
        * Replace current element with HTMLString or a ugma wrapped object
        *
        * @param {Mixed} content HTMLString, nodeTree, native DOM element or functor that returns content
        * @return {Object} The wrapped collection
        * @chainable
        * @example
        *
        *     var div = ugma.render("div>span>`foo`");   
        *         div.child(0).replace(ugma.render("b>`bar`"));
        */    
        replaceWith: [ "", false, true, function( node, relatedNode )  {
            node.parentNode.replaceChild( relatedNode, node );
        }],
       /**
        * Remove current element from the DOM
        *
        * @param {Mixed} content HTMLString, nodeTree, native DOM element or functor that returns content
        * @return {Object} The wrapped collection
        * @chainable
        * @example
        *     link.remove();
        *
        *     var foo = ugma.query(".bar");
        *     bar.remove();    
        */    
        remove: [ "", false, true, function( node )  {
            node.parentNode.removeChild( node );
        }]
    }, function(methodName, adjacentHTML, native, requiresParent, strategy)  {return function() {var this$0 = this;
        
          var contents = helpers$$sliceArgs( arguments ),
              node = this[ 0 ];
    
        if ( requiresParent && !node.parentNode ) return this;
    
        if ( ( methodName === "after" || methodName === "before" ) && this === core$core$$ugma ) {
             minErr$$minErr( methodName + "()", "You can not " + methodName + " an element non-existing HTML (documentElement)" );
        }
        
        // don't create fragment for adjacentHTML
        var fragment = adjacentHTML ? "" : node.ownerDocument.createDocumentFragment();
    
        contents.forEach( function( content )  {
    
            // Handle native DOM elements 
            // e.g. link.append(document.createElement('li'));
            if ( native && content.nodeType === 1 ) content = core$core$$nodeTree( content );
    
            if ( helpers$$is( content, "function" ) ) content = content( this$0 );
    
            // merge a 'pure' array into a string
            if ( helpers$$isArray( content ) && !helpers$$is( content[ 0 ], "object" ) ) content = content.join();
    
            if ( helpers$$is( content, "string" ) ) {
                if (helpers$$is( fragment, "string" ) ) {
                    fragment += helpers$$trim( content );
                } else {
                    content = core$core$$ugma.renderAll( content );
                }
            } else if ( core$core$$instanceOf(content) ) {
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
                        fragment.appendChild( core$core$$instanceOf(el) ? el[ 0 ] : el );
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
        
    }}, function()  {return RETURN_THIS} );

    core$core$$implement({
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
                if ( node.parentNode ) node.parentNode.selectedIndex;
    
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
    core$core$$implement({
       /**
         * Returns `true` if the element would be selected by the specified selector string; otherwise, returns `false`.
         * @param  {String} selector Selector to match against element
         * @return {Boolean} returns true if success and false otherwise
         *
         * @example
         *    link.matches('.match');
         */
        matches: function(selector) {
            if ( !selector || !helpers$$is( selector, "string" ) ) minErr$$minErr( "matches()", "The string did not match the expected pattern" );
                // compare a match with CSS pseudos selectors 
                // e.g "link.matches(":enabled") or "link.matches(":checked")
                var checker = util$pseudoClasses$$default[ selector ] ||  util$selectormatcher$$default( selector );
                return !!checker( this[ 0 ] );
        }
    }, null, function()  {return RETURN_FALSE} );

    core$core$$implement({
       /**
        * Calculates offset of the current element
        * @return object with left, top, bottom, right, width and height properties
        * @example
        *     link.offset();
        */
        offset: function() {
    
            var node = this[ 0 ],
                docElem = node.ownerDocument.documentElement,
                clientTop = docElem.clientTop,
                clientLeft = docElem.clientLeft,
                scrollTop = WINDOW.pageYOffset || docElem.scrollTop,
                scrollLeft = WINDOW.pageXOffset || docElem.scrollLeft,
                boundingRect = node.getBoundingClientRect();
    
            return {
                top: boundingRect.top + scrollTop - clientTop,
                left: boundingRect.left + scrollLeft - clientLeft,
                right: boundingRect.right + scrollLeft - clientLeft,
                bottom: boundingRect.bottom + scrollTop - clientTop,
                width: boundingRect.right - boundingRect.left,
                height: boundingRect.bottom - boundingRect.top
            };
        },
    
      /**
       * Calculate width based on element's offset
       * @return {Number} element width in pixels
       * @example
       *
       *    <div id="rectangle" style="font-size: 10px; width: 20em; height: 10em"></div>
       *
       *   ugma.query('#rectangle').width();
       *      // -> 200
       */    
       width: function() { return this.offset().width },
     
      /**
       * Calculate height based on element's offset
       * @return {Number} element height in pixels
       * @example
       *
       *    <div id="rectangle" style="font-size: 10px; width: 20em; height: 10em"></div>
       *
       *   ugma.query('#rectangle').height();
       *      // -> 100
       */    
       height: function() { return this.offset().height }
       
    }, null, function(methodName)  {return function()  { return methodName === "offset" ? { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 } : 0 }} );

    core$core$$implement({
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
        offsetParent: function() {
            var node = this[ 0 ],
                offsetParent = node.offsetParent || HTML,
                isInline = this.css( "display" ) === "inline";
    
            if ( !isInline && offsetParent ) return core$core$$nodeTree( offsetParent );
    
            while ( offsetParent && core$core$$nodeTree(offsetParent).css( "position" ) === "static" ) {
                offsetParent = offsetParent.offsetParent;
            }
    
            return core$core$$nodeTree( offsetParent );
        }
    }, null, function()  {return RETURN_FALSE});

    var modules$query$$fasting  = /^(?:(\w+)|\.([\w\-]+))$/,
        modules$query$$rescape  = /'|\\/g;

    core$core$$implement({
     /**
      * Find the first matched element by css selector
      * @param  {String} selector css selector
      * @example
      *
      *      ugma.query('#foo'); 
      *      // first, single element
      */
        query: "",
     /**
      * Find all matched elements by css selector
      * @param  {String} selector css selector
      * @example
      *
      *      ugma.queryAll('#div'); 
      *      // return an array with multiple divs
      *
      *      ugma.query('a[href="#"]');
      *      // -> all links with a href attribute of value "#"
      *
      *      ugma.query('div:empty');
      *      // -> all DIVs without content (i.e., whitespace-only)
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
        modules$ready$$isReady = ( HTML.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/ ).test( DOCUMENT.readyState ),
        modules$ready$$pageLoaded;

    if ( !modules$ready$$isReady ) {
        DOCUMENT.addEventListener( "DOMContentLoaded", modules$ready$$pageLoaded = function()  { // works for modern browsers and IE9
            DOCUMENT.removeEventListener("DOMContentLoaded", modules$ready$$pageLoaded );
            modules$ready$$isReady = 1;
            while ( modules$ready$$pageLoaded = modules$ready$$readyCallbacks.shift() ) modules$ready$$pageLoaded();
        });
        
        WINDOW.addEventListener( "load", modules$ready$$pageLoaded); // fallback to window.onload for others
    }
    core$core$$implement({
      /**
       * Add a function to execute when the DOM is ready
       * @param {Function} callback event listener
       * @return {Object} The wrapped collection
       * @example
       *     ugma.ready(callback);
       */  
      
        ready: function( fn ) {
            if ( !helpers$$is( fn, "function") ) minErr$$minErr("ready()", "The provided 'callback' is not a function.");
           // call imediately when DOM is already ready
            if ( modules$ready$$isReady ) {
                fn();
            } else {
                 // add to the list
                modules$ready$$readyCallbacks.push( fn );
            }
        }
    });

    core$core$$implement({
     /**
      * Scrolls the window so that the `element` appears at the top of the viewport.
      * @example
      * 
      *  link.scrollTo();
      *   // -> Element 
      * 
      *  link.scrollTo(20, 100);
      *   // -> Element 
      */
        scrollTo: function(x, y) {
          
          var node = this[0],
              offset = this.offset();
          
          WINDOW.scrollTo(x || offset.left, y || offset.top);
    
        }
    }, null, function()  {return RETURN_FALSE});

    var modules$set$$objectTag = "[object Object]",
        modules$set$$getTagName = function( node )  {
        var tag = node.tagName;
       return (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "OPTION");
   };

    core$core$$implement({
      /**
       * Set property/attribute value by name
       * @param {String|Object|Array}   name    property/attribute name
       * @param {String|Function}       value   property/attribute value or functor
       * @chainable
       * @example 
       *
       *    link.set('attrName', 'attrValue');                  // set
       *    link.set({'attr1', 'value1'}, {'attr2', 'value2});  // object with key-value pairs
       *    link.set("data-fooBar", "foo");                     // set custom attribute data-custom
       *    link.set(["autocomplete", "autocorrect"], "off");   // array of key values
       *    link.set("attrName", null);                         // remove attribute / property value
       *
       *    link.set("innerHTML", "Hello, World!");             // set 'innerHTML'
       *    link.set("textContent", "I'm pure text");           // set 'textContent'
       *    link.set("value", "valueProp");                     // set 'value'
       *
       * @boolean attributes - example
       *
       *    link.set("checked", checked);    // handle boolean attributes by using name as value ( better performance )
       *    link.set("checked", true);       // set custom attribute data-custom
       */
        set: function(name, value) {var this$0 = this;
    
            var node = this[ 0 ];
            // getter
            if ( arguments.length === 1 ) {
                if ( helpers$$is( name, "function" ) ) {
                    value = name;
                } else {
                    // convert the value to a string
                    value = name == null ? "" : "" + name;
                }
               // when `value` is not a 'plain' object
                if ( value !== modules$set$$objectTag ) {
    
                    if ( modules$set$$getTagName( node ) ) {
                        name = "value";
                    } else {
                        name = "innerHTML";
                    }
                }
            }
    
            var hook = util$accessorhooks$$default.set[ name ],
                subscription = ( this._.subscription || {} )[ name ],
                previousValue;
    
            // grab the previous value if it's already a subscription on this attribute / property,
            if ( subscription ) previousValue = this.get( name );
    
            if ( helpers$$is(name, "string" ) ) {
    
                /**
                 *
                 * The National Information Exchange Model (NIEM: http://en.wikipedia.org/wiki/National_Information_Exchange_Model) says to use:
                 *
                 * -  Upper CamelCase (PascalCase) for elements.
                 * -  lower camelCase for attributes.
                 */
    
                   var lowercasedName = name.toLowerCase();
    
                // handle executable functions
                if (helpers$$is(value, "function")) value = value( this );
    
                if ( value == null ) {
                    node.removeAttribute( name );
                // Grab necessary hook if one is defined
                } else if ( hook ) {
                    hook( node, value );
                   // set property 
                } else if ( name in node ) { 
                    node[ name ] = value;
                  // set attribute
                } else {
                    node.setAttribute( lowercasedName, value + "" );
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
    
            // Trigger all relevant attribute / nameerty changes.
            if ( subscription && previousValue !== value )  helpers$$each( subscription, function( cb )  { helpers$$invoke(this$0, cb, value, previousValue) } );
    
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
    var modules$shadow$$MUTATION_WRAPPER =  "div[style=overflow:hidden]>object[data=`about:blank` type=text/html style=`position:absolute` width=100% height=100%]";

    if ( INTERNET_EXPLORER ) {
        modules$shadow$$MUTATION_WRAPPER = modules$shadow$$MUTATION_WRAPPER.replace( "position:absolute", "width:calc(100% + 4px);height:calc(100% + 4px);left:-2px;top:-2px;position:absolute").replace( "data=`about:blank` ", "" );
    }

    // Chrome/Safari/Opera have serious bug with tabbing to the <object> tree:
    // https://code.google.com/p/chromium/issues/detail?id=255150
    core$core$$implement({
        shadow: function(name) {var callback = arguments[1];if(callback === void 0)callback = function()  {};
            var contexts = this._.shadow || ( this._.shadow = {} ),
                data = contexts[name] || [];
    
            if (data[ 0 ] ) {
                // callback is always async
                WINDOW.setTimeout(function()  { callback(data[ 1 ] ) }, 1 );
    
                return data[ 0 ];
            }
    
            var ctx = core$core$$ugma.render(modules$shadow$$MUTATION_WRAPPER),
                object = ctx.get( "firstChild" );
            // set onload handler before adding element to the DOM
            object.onload = function()  {
                // apply user-defined styles for the context
                if ( ctx.addClass( name ).css( "position" ) === "static" ) ctx.css( "position", "relative" );
    
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

    core$core$$implement({
      /**
       * Subscribe on particular properties / attributes, and get notified if they are changing
       * @param  {String}   name     property/attribute name
       * @param  {Function}  callback  function for notifying about changes of the property/attribute
       * @chainable
       * @example
       *     link.subscribe("value", function(value, oldValue) { });
       */
        subscribe: function(name, callback) {
                var subscription = this._.subscription || ( this._.subscription = [] );
    
                if ( !subscription[ name ] ) subscription[ name ] = [];
    
                subscription[ name ].push( callback );
    
                return this;
            },
     /**
      * Cancel / stop a property / attribute subscription
      * @param  {String}   name    property/attribute name
      * @param  {Function}  callback  function for notifying about changes of the property/attribute
      * @chainable
      * @example
      *     link.unsubscribe("value", function(value, oldValue) { });
      */
       unsubscribe: function(name, callback) {
                var subscription = this._.subscription;
    
                if ( subscription[ name ] ) subscription[ name ] = helpers$$filter( subscription[ name ], function( cb )  {return cb !== callback} );
    
                return this;
            }
    }, null, function()  {return RETURN_THIS} );

    core$core$$implement({
    
        /**
         * Find first element to the supplied element filtered by optional selector
         * @param {String} [selector] css selector
         * @chainable
         * @example
         *    link.first();
         */
        first: "firstElementChild",
        /**
         * Find last element to the supplied element filtered by optional selector
         * @param {String} [selector] css selector
         * @chainable
         * @example
         *
         *      <div id="australopithecus">
         *        <div id="homo-erectus"><!-- Latin is super -->
         *          <div id="homo-neanderthalensis"></div>
         *          <div id="homo-sapiens"></div>
         *        </div>
         *      </div>
         *
         *      ugma.query('#australopithecus').first().get("id")
         *      // -> div#homo-erectus
         *
         *      ugma.query('#homo-erectus')[0].firstChild
         *      // -> comment node "Latin is super"
         *
         *      ugma.query('#homo-erectus').first()
         *      // -> div#homo-neanderthalensis
         *
         */
        last: "lastElementChild",
        /**
         * Find next sibling element filtered by optional selector
         * @param {String} [selector] css selector
         * @chainable
         * @example
         *    link.next();             
         *    link.next("i"); 
         */
        next: "nextElementSibling",
        /**
         * Find previous sibling element filtered by optional selector
         * @param {String} [selector] css selector
         * @chainable
         * @example
         *
         *      <ul id="fruits">
         *        <li id="apples">
         *          <h3 id="title">Apples</h3>
         *          <ul id="list-of-apples">
         *            <li id="golden-delicious">Golden Delicious</li>
         *            <li id="mutsu">Mutsu</li>
         *            <li id="mcintosh" class="yummy">McIntosh</li>
         *            <li id="ida-red" class="yummy">Ida Red</li>
         *          </ul>
         *          <p id="saying">An apple a day keeps the doctor away.</p>  
         *        </li>
         *      </ul>
         *
         *  Get the first sibling after "#title":
         *  
         *      ugma.query('title').next();
         *      // -> ul#list-of-apples
         *
         *  Get the first sibling after "#title" with node name "p":
         *
         *      ugma.query('title').next('p');
         *      // -> p#sayings
         *
         *  Get the first sibling after "#golden-delicious" with class name "yummy":
         *      
         *      ugma.query('golden-delicious').next('.yummy');
         *      // -> li#mcintosh
         *
         *  Try to get the first sibling after "#ida-red":
         *
         *      ugma.query('ida-red').next();
         *      // -> undefined   
         */   
          prev: "previousElementSibling",
        /**
         * Find all next sibling elements filtered by optional selector
         * @param {String} [selector] css selector
         * @chainable
         * @example
         *
         *      <ul id="fruits">
         *        <li id="apples">
         *          <h3>Apples</h3>
         *          <ul id="list-of-apples">
         *            <li id="golden-delicious" class="yummy">Golden Delicious</li>
         *            <li id="mutsu" class="yummy">Mutsu</li>
         *            <li id="mcintosh">McIntosh</li>
         *            <li id="ida-red">Ida Red</li>
         *          </ul>
         *          <p id="saying">An apple a day keeps the doctor away.</p>  
         *        </li>
         *      </ul>
         * Get the first previous sibling of "#saying":
         *  
         *      $('saying').prev();
         *      // -> ul#list-of-apples
         *
         *  Get the first previous sibling of "#ida-red" with class name "yummy":
         *
         *      ugma.query('#ida-red').prev('.yummy').get("id");
         *      // -> li#mutsu
         */
        nextAll: "nextElementSibling",
        /**
         * Find all previous sibling elements filtered by optional selector
         * @param {String} [selector] css selector
         * @chainable
         * @example
         *     link.nextAll();
         *     link.nextAll("i");
         */
        prevAll: "previousElementSibling"
        
    }, function(methodName, propertyName)  {return function( selector ) {
    
        if ( selector && !helpers$$is( selector, "string" ) ) minErr$$minErr( methodName + "()", "The provided argument did not match the expected pattern" );
    
        var currentNode = this[ 0 ],
            matcher = util$selectormatcher$$default( selector ),
            all = methodName.slice( -3 ) === "All",
            descendants = all ? [] : null;
    
        if ( !matcher ) currentNode = currentNode[ propertyName ];
    
        for (; currentNode; currentNode = currentNode[ propertyName ] ) {
            if ( currentNode.nodeType === 1 && ( !matcher || matcher( currentNode ) ) ) {
                if ( !all ) break;
    
                descendants.push( currentNode );
            }
        }
    
        return all ? helpers$$map( descendants, core$core$$nodeTree ) : core$core$$nodeTree( currentNode );
    }}, function( methodName )  {return function()  {return methodName.slice( -3 ) === "All" ? [] : new core$core$$dummyTree()}} );

    core$core$$implement({
        /**
         * Show an element
         * @param {Function} [callback]
         * @chainable
         * @example
         *     
         *  Show a single element:
         *     
         *    link.show(); // displays element
         *
         *    foo.show(function() { });
         *
         *  Show multiple elements using 'native' Array.prototype.forEach:
         *  
         *    ugma.queryAll('.foo').forEach(function(node) { node.show(); ); }  // 'this' keyword can also be used
         *  
         *  Show single element using callback:
         *  
         *    foo.show(function() { query(#.bar").hide()   });
         */
        show: false,
        /**
         * Hide an element
         * @param {Function} [callback]
         * @chainable
         * @example
         *     
         *  Show a single element:
         *     
         *    link.hide(); // hide element
         *
         *  Hide multiple elements using 'native' Array.prototype.forEach:
         *  
         *    ugma.queryAll('.foo').forEach(function(node) { node.hide(); ); } // 'this' keyword can also be used
         *  
         *  Hide single element using callback:
         *  
         *    foo.hide(function() { query(#.bar").show()   });
         */
        hide: true,
    
        /**
         * Toggle an element
         * @param {Boolean}  
         * @param {Function} [callback]
         * @chainable
         * @example
         * link.toggle(); // toggles element visibility
         *
         * link.toggle(true); // forces 'true' state
         *
         * link.toggle(false); // forces 'false' state
         *
         * foo.toggle(function() { });
         */
        toggle: null
    
    }, function( methodName, condition )  {return function( state, callback ) {var this$0 = this;
    
        // Boolean toggle()
        if ( methodName === "toggle" && helpers$$is( state, "boolean" ) ) {
            condition = state;
            state = null;
        }
    
        if ( !helpers$$is(state, "string" ) ) {
            callback = state;
            state = null;
        }
    
        if ( callback && !helpers$$is( callback, "function") ) minErr$$minErr( methodName + "()", "This operation is not supported" );
    
        var node = this[ 0 ],
            style = node.style,
            computed = helpers$$computeStyle( node ),
            isHidden = condition,
            frameId = this._.frame,
            done = function()  {
                this$0.set( "aria-hidden", String( isHidden ) );
    
                style.visibility = isHidden ? "hidden" : "inherit";
    
                this$0._.frame = null;
    
                if ( callback ) callback( this$0 );
            };
    
        if ( !helpers$$is(isHidden, "boolean" ) ) isHidden = computed.visibility !== "hidden";
    
        // cancel previous frame if it exists
        if ( frameId ) util$raf$$cancelFrame( frameId );
    
        if ( !node.ownerDocument.documentElement.contains( node ) ) {
            done();
        } else {
            this._.frame = util$raf$$requestFrame( done );
        }
    
        return this;
    
    }}, function()  {return function()  {return RETURN_THIS}} );

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

    var template$multiple$$dollarRegex = /\$/g,
        template$multiple$$indexRegex = /(\$+)(?:@(-)?(\d+)?)?/g,
        template$multiple$$multiple = function( num, term )  {
    
            /**
             * Set limit to 'max' 1600 HTML  created at once
             * else ' new Array' will throw, and the whole 
             * process will become slow if more then 1800.
             */
    
            if ( num >= 1600 ) num = 1600;
            
            // normalize to avoid negative values
            if ( num <= 0 ) num = 1;
    
            var i = num,
                result = new Array( i );
    
            // while loop iteration gives best performance
            while ( i-- ) {
                result[ i ] = term.replace( template$multiple$$indexRegex, function( expr, fmt, sign, base )  {
                    var pos = ( sign ? num - i - 1 : i ) + ( base ? +base : 1 );
                    // handle zero-padded index values, like $$$ etc.
                    return ( fmt + pos ).slice( -fmt.length ).replace( template$multiple$$dollarRegex, "0" );
                });
            }
            return result;
        };

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
    
        if ( helpers$$is( rawValue, "string" ) ) value = rawValue;
        // handle boolean attributes by using name as value
        if ( !helpers$$is( value, "string" ) ) value = name;
       
        // always wrap attribute values with quotes even they don't exist
        return " " + name + "=" + quote + value + quote;
    }

    function template$replaceAttr$$replaceAttr( term, adjusted ) {
        return function( html )  {
             // find index of where to inject the term
             var index = adjusted ? html.lastIndexOf( "<" ) : html.indexOf( ">" );
             // inject the term into the HTML string
             return html.slice( 0, index ) + term + html.slice( index );
         };
     }

    /* es6-transpiler has-iterators:false, has-generators: false */

    // Reference: https://github.com/emmetio/emmet

    var template$template$$dot = /\./g,
        template$template$$abbreviation = /`[^`]*`|\[[^\]]*\]|\.[^()>^+*`[#]+|[^()>^+*`[#.]+|\^+|./g,
        template$template$$templateHooks = {},
        template$template$$tagCache = { "": "" };

    // Expose 'templateHooks' to the global scope
    core$core$$ugma.templateHooks = function( obj )  {
    
        if ( helpers$$is( obj, "object" ) && !helpers$$isArray( obj ) ) {
    
            helpers$$forOwn( obj, function( key, value )  {
                if ( helpers$$is( value, "string" ) ) {
                    template$template$$templateHooks[ key ] = value;
                }
            });
        }
    };

    core$core$$ugma.template = function( template, args ) {
    
        if ( !helpers$$is(template, "string" ) ) minErr$$minErr( "template()", "The first argument need to be a string" );
    
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
                    if ( str[ 0 ] === "[" || str[ 0 ] === "`" ) output.push( str.slice( 1, -1 ) );
    
                    // handle multiple classes, e.g. a.one.two
                    if ( str[ 0 ] === "." ) output.push( str.slice( 1 ).replace( template$template$$dot, " ") );
    
                    stack.unshift( str[ 0 ] );
                }
            } else {
                output.push( str );
            }
        });
    
        output = output.concat( stack );
    
        return template$process$$process( output );
    };

    // populate empty tag names with result
    helpers$$each( "area base br col hr img input link meta param command keygen source".split(" "), function( tag )  { template$template$$tagCache[ tag ] = "<" + tag + ">" });

    var template$template$$default = template$template$$tagCache;
    // return tag's from tagCache with tag type
    function template$processTag$$processTag( tag ) {
        return template$template$$default[ tag ] || ( template$template$$default[ tag ] = "<" + tag + "></" + tag + ">" );
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
        template$process$$escapeChars = function( str )  {
           // always make sure the'str' argument is a string, in a few 'rare' 
           // cases it could be an array, and ugma will throw
           return helpers$$is( str, "string") && str.replace( /[&<>"'¢¥§©®™]/g, function( ch )  {return template$process$$charMap[ ch ]} );
        },
        template$process$$process = function( template )  {
    
        var stack = [];
    
        helpers$$each( template, function( str )  {
    
            if ( str in template$operators$$default ) {
    
                var value = stack.shift(),
                    node = stack.shift();
    
                if ( helpers$$is( node, "string" ) ) node = [ template$processTag$$processTag( node ) ];
    
                if ( helpers$$is( node, "undefined" ) || helpers$$is( value, "undefined" ) ) minErr$$minErr("ugma.render()", "This operation is not supported" );
    
                if (str === "#" ) { // id
                    value = template$replaceAttr$$replaceAttr(" id=\"" + value + "\"" );
                } else if ( str === "." ) { // class
                    value = template$replaceAttr$$replaceAttr(" class=\"" + value + "\"" );
                } else if ( str === "[" ) { // id
                    value = template$replaceAttr$$replaceAttr( value.replace( template$process$$attributes, template$parseAttr$$parseAttr ) );
                } else if ( str === "*" ) { // universal selector 
                    node = template$multiple$$multiple( +value, node.join( "" ) );
                } else if ( str === "`" ) { // Back tick
                    stack.unshift(node);
                    // escape unsafe HTML symbols
                    node = [ template$process$$escapeChars( value ) ];
                } else { /* ">", "+", "^" */
                    value = helpers$$is( value, "string" ) ? template$processTag$$processTag( value ) : value.join( "" );
    
                    if ( str === ">" ) {
                        value = template$replaceAttr$$replaceAttr( value, true );
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

    core$core$$implement({
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
            sandbox = this._.sandbox || (this._.sandbox = doc.createElement("div"));
    
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

    // Create a ugma wrapper object for a native DOM element or a
    // jQuery element. E.g. (ugma.native($('#foo')[0]))
    core$core$$ugma.native = function(node)  {
        var nodeType = node && node.nodeType;
        return ( nodeType === 9 ? core$core$$domTree : core$core$$nodeTree )( nodeType === 1 || nodeType === 9 ? node : null );
    };

    /*
     * Map over the previous value of the `ugma` namespace variable, so that it can be restored later on.
     */

    var core$noConflict$$_ugma = WINDOW.ugma;

    /**
     * In case another library sets the `ugma` variable before ugma does,
     * this method can be used to return the original `ugma` namespace to that other library.
     *
     * @return {Object} Reference to ugma.
     * @example
     *     var ugma = ugma.noConflict();
     */

    core$core$$ugma.noConflict = function()  {
        if ( WINDOW.ugma === core$core$$ugma ) WINDOW.ugma = core$noConflict$$_ugma;
        return core$core$$ugma;
    };

    // Current version of the library. Keep in sync with `package.json`.
    core$core$$ugma.version = "0.0.3a";

    WINDOW.ugma = core$core$$ugma;
})();
