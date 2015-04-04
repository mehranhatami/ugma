/**
 * @module helpers
 */

/**
 * @private methods
 */

import { DOCUMENT, WINDOW              } from "./const";
import { minErr                        } from "./minErr";
import { domTree, nodeTree, dummyTree  } from "./core/core";

// jshint unused:false

// Create local references to Array.prototype methods we'll want to use later.
var arrayProto = Array.prototype;

/**
 * Checks if the given callback returns a true(-ish) value for each element in the collection.
 * @example
 *     link.every(function(element) {
 *         return element.hasAttribute('active')
 *     });
 *     // true/false
 */

export const every = arrayProto.every;
export const slice = arrayProto.slice;

/**
 * Determine whether the argument is an array.
 *
 * @param {Object} [obj] Object to test whether or not it is an array.
 * @return {boolean} 
 * @example
 *     isArray([]);
 *     // true
 * @example
 *     isArray({});
 *     // false
 */
export const isArray = Array.isArray;

  var onlyOnce = (fn) => {
        var called = false;
        return function() {
            if ( called ) minErr("onlyOnce()", "Callback was already called.");
            called = true;
            fn.apply( this, arguments );
        };
  },
 /**
  * Invokes the `callback` function once for each item in `arr` collection, which can only be an array.
  *
  * @param {Array} collection
  * @param {Function} callback
  * @return {Array}
  * @private
  */
   each = ( collection, callback ) => {
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
    asyncEach = ( arr, iterator, callback ) => {
        callback = callback || function () {};
        if ( !arr.length ) {
            return callback();
        }
        var completed = 0;
        each( arr, function ( x ) {
            iterator( x, onlyOnce( done ) );
        });
        function done( err ) {
          if ( err ) {
              callback( err );
              callback = function () {};
          }
          else {
              completed += 1;
              if ( completed >= arr.length ) {
                  callback();
              }
          }
        }
    },

   /**
    * Create a new collection by executing the callback for each element in the collection.
    * @example
    *     link.map(function(element) {
    *         return element.getAttribute('name')
    *     });
    *     // ['ever', 'green']
    */     
     
    map = (collection, callback) => {
        var arr = collection || [],
            result = [];
      // Go through the array, translating each of the items to their
      // new value (or values).
        each(arr, ( value, key ) => {
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
    is = (obj, type) => {
        return typeof obj === type;
    },

    // Iterates over own enumerable properties of an object, executing  the callback for each property.
    forOwn = (object, callback) => {

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
    
    filter = ( collection, predicate ) => {
        var arr = collection || [],
            result = [];

        forOwn( arr, ( index, value ) => {
            if ( predicate( value, index, arr ) ) {
                result.push( value );
            }
        });
        return result;
    },

    trim = ( value ) => {
        return is( value, "string" ) ? value.trim() : value;
    },

    inArray = (arr, searchElement, fromIndex) => {
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

    invoke = (context, fn, arg1, arg2) => {
        if ( is(fn, "string" ) ) fn = context[ fn ];

        try {
            return fn.call(context, arg1, arg2);
        } catch (err) {
            WINDOW.setTimeout( () => { throw err }, 1 );

            return false;
        }
    },
    // internal method to extend ugma with methods - either 
    // the nodeTree or the domTree
    implement = (obj, callback, mixin) => {

        if (!callback) callback = (method, strategy) => strategy;

        forOwn(obj, ( method, func) => {
            var args = [ method] .concat( func );
            (mixin ? nodeTree : domTree).prototype[ method ] = callback.apply(null, args);

            if (mixin) dummyTree.prototype[ method ] = mixin.apply(null, args);
        });
    },

    // Faster alternative then slice.call
    sliceArgs = (arg) => {
        var i = arg.length,
            args = new Array(i || 0);

        while (i--) {
            args[ i ] = arg[ i ];
        }
        return args;
    },

    reDash = /([\:\-\_]+(.))/g,
    mozHack = /^moz([A-Z])/,

    // Convert dashed to camelCase
    // Support: IE9-11+
    camelize = ( prop ) => {
        return prop && prop.replace(reDash, (_, separator, letter, offset) => {
            return offset ? letter.toUpperCase() : letter;
        }).replace (mozHack, "Moz$1" );
    },

    // getComputedStyle takes a pseudoClass as an optional argument, so do we
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
    computeStyle = ( node, pseudoElement ) => {
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

    injectElement = (node) => {
        if ( node && node.nodeType === 1 ) return node.ownerDocument.head.appendChild( node );
    };

/*
 * Export interface
 */        
export { each, asyncEach, map, forOwn, filter, is, trim, inArray, invoke, implement, sliceArgs, camelize, computeStyle, injectElement };