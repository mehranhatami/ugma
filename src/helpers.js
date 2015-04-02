import { DOCUMENT, WINDOW              } from "./const";
import { domTree, nodeTree, dummyTree  } from "./core/core";

// jshint unused:false

// Create local references to Array.prototype methods we'll want to use later.
var arrayProto = Array.prototype;

export const every = arrayProto.every;
export const slice = arrayProto.slice;
export const isArray = Array.isArray;

// Invokes the `callback` function once for each item in `arr` collection, which can only be an array.
var each = (collection, callback) => {
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
    map = (collection, callback) => {
        var arr = collection || [],
            result = [];
        each(arr, ( value, key ) => {
            result.push( callback( value, key ) );
        });
        return result;
    },

    // is() returns a boolean for if typeof obj is exactly type.
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
    // create a new array with all elements that pass the test implemented by the provided function.
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
        
export { each, map, forOwn, filter, is, trim, inArray, invoke, implement, sliceArgs, camelize, computeStyle, injectElement };