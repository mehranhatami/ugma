/**
 * @module helpers
 */

/**
 * @private methods
 */

import { DOCUMENT, WINDOW  } from "./const";
import { ugma              } from "./core/core";

// jshint unused:false

// Create local references to Array.prototype methods we'll want to use later.
var arrayProto = Array.prototype;

export const every = arrayProto.every;
export const slice = arrayProto.slice;
export const keys  = Object.keys;
export const isArray = Array.isArray;

/**
 * Invokes the `callback` function once for each item in `arr` collection, which can only be an array.
 *
 * @param {Array} collection
 * @param {Function} callback
 * @return {Array}
 * @private
 */
 var each = ( collection, callback ) => {
            var arr = collection || [],
                index = -1,
                length = arr.length;
            while ( ++index < length )
                if ( callback( arr[ index ], index, arr ) === false ) break;
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
     
    map = ( array, callback ) => {
          array = array || [];
            var result = [];
        each(array, ( value, key ) => {
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
    is = ( obj, type ) => typeof obj === type,

    // Iterates over own enumerable properties of an object, executing  the callback for each property.
    forOwn = ( object, callback ) => {

            var obj = object || {},
                key,
                index = -1,
                props = keys( obj ),
                length = props.length;

            while (++index < length) {

                key = props[ index ];

                if ( callback( key, obj[ key ], obj ) === false) break;
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
    
    filter = ( array, predicate ) => {
        array = array || [];
        
          var result = [];

        forOwn( array, ( index, value ) => {
            if ( predicate( value, index, array ) ) result.push( value );
        });
        return result;
    },

    // Bind a function to a context, optionally partially applying 
	// one or two arguments.
    proxy = ( context, fn, arg1, arg2 ) => {

        if ( is( fn, "string" ) ) fn = context[ fn ];

        try {
            return fn.call( context, arg1, arg2 );
        } catch ( err ) {
            WINDOW.setTimeout( () => {
                throw err;
            }, 1);

            return false;
       }    
    },

    // Faster alternative then slice.call
    sliceArgs = ( arg ) => {
        var i = arg.length,
            args = [];

        while ( i-- ) args[ i ] = arg[ i ];

        return args;
    },

    reDash = /([\:\-\_]+(.))/g,
    mozHack = /^moz([A-Z])/,

 /**
  * Convert a string to camel case notation.
  * @param  {String} str String to be converted.
  * @return {String}     String in camel case notation.
  */
    camelize = ( str ) => {
        return str && str.replace( reDash, (_, separator, letter, offset) => {
            return offset ? letter.toUpperCase() : letter;
        }).replace( mozHack, "Moz$1" );
    },

 /**
  * http://www.w3.org/TR/DOM-Level-2-Style
  *
  * Support for pseudo-elements in getComputedStyle for plug-ins
  *
  */
    computeStyle = ( node, pseudoElement ) => {
        // Support: IE<=11+, Firefox<=30+
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through 'defaultView.getComputedStyle'
        if ( node && node.ownerDocument.defaultView.opener ) {
            return ( node.ownerDocument.defaultView ||
                // This will work if the ownerDocument is a shadow DOM element
                DOCUMENT.defaultView ).getComputedStyle( node, pseudoElement || null );
        }
        return WINDOW.getComputedStyle( node, pseudoElement || null );
    };

/*
 * Export interface
 */        
export { each, map, forOwn, filter, is, proxy, sliceArgs, camelize, computeStyle };