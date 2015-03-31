import { DOCUMENT, WINDOW } from "./const";
import { domTree, nodeTree, dummyTree } from "./core";
// jshint unused:false
// Save a reference to some core methods
var arrayProto = Array.prototype;

export const every = arrayProto.every;
export const slice = arrayProto.slice;
export const isArray = Array.isArray;
export const keys = Object.keys;

// Invokes the `callback` function once for each item in `arr` collection, which can only 
// be an array.
var each = (arr, callback) => {
        if (arr && callback) {
            var index = -1,
                length = arr.length;

            while (++index < length) {
                if (callback(arr[index], index, arr) === false) {
                    break;
                }
            }
        }
        return arr;
    },

    // Create a new array with the results of calling a provided function 
    // on every element in this array.
    map = (collection, callback) => {
        if (collection) {
            var result = [];
            each(collection, (value, key) => {
                result.push(callback(value, key));
            });
            return result;
        }
        return null;
    },
    // Iterates over own enumerable properties of an object, executing 
    // the callback for each property.
    forOwn = (obj, callback) => {
        if (obj) {
            var index = -1,
                props = Object.keys(obj),
                length = props.length;

            while (++index < length) {
                var key = props[index];
                if (callback(key, obj[key], obj) === false) {
                    break;
                }
            }
        }
        return obj;
    },
    // create a new array with all elements that pass the test implemented 
    // by the provided function.
    filter = (collection, predicate) => {
        var result = [];
        forOwn(collection, (index, value) => {
            if (predicate(value, index, collection)) {
                result.push(value);
            }
        });
        return result;
    },

    // is() returns a boolean for if typeof obj is exactly type.
    is = (obj, type) => {
        // Support: IE11
        // Avoid a Chakra JIT bug in compatibility modes of IE 11.
        // https://github.com/jashkenas/underscore/issues/1621 for more details.
        return type === "function" ?
            typeof obj === type || false :
            typeof obj === type;
    },

    // Support: Android<4.1
    // Make sure we trim BOM and NBSP
    atrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

    // Support: Android<4.1
    trim = (value) => {
        return is(value, "string") ? (value + "").replace(atrim, "") : value;
    },

    inArray = (arr, searchElement, fromIndex) => {
        fromIndex = fromIndex || 0;
        /* jshint ignore:start */
        if (fromIndex > arr.length) {

            arr - 1;
        }
        /* jshint ignore:end */
        var i = 0,
            len = arr.length;
        for (; i < len; i++) {
            if (arr[i] === searchElement && fromIndex <= i) {
                return i;
            }

            if (arr[i] === searchElement && fromIndex > i) {
                return -1;
            }
        }
        return -1;
    },

    invoke = (context, fn, arg1, arg2) => {
        if (typeof fn === "string") fn = context[fn];

        try {
            return fn.call(context, arg1, arg2);
        } catch (err) {
            /* istanbul ignore next */
            WINDOW.setTimeout(() => {
                throw err;
            }, 1);

            return false;
        }
    },
    // internal method to extend our uClass with methods - either 
    // Element prototype or Document prototype

    implement = (obj, callback, mixin) => {

        if (!callback) {
            callback = function(method, strategy) {
                return strategy;
            };
        }

        forOwn(obj, (method, func) => {
            var args = [method].concat(func);
            (mixin ? nodeTree : domTree).prototype[method] = callback.apply(null, args);

            if (mixin) {
                dummyTree.prototype[method] = mixin.apply(null, args);
            }
        });
    },

    // Faster alternative then slice.call
    sliceArgs = (arg) => {
        var i = arg.length,
            args = new Array(i || 0);
        while (i--) {
            args[i] = arg[i];
        }
        return args;
    },

    reDash = /([\:\-\_]+(.))/g,
    mozHack = /^moz([A-Z])/,

    // Convert dashed to camelCase
    // Support: IE9-11+
    camelize = (prop) => {
        return prop && prop.replace(reDash, (_, separator, letter, offset) => {
            return offset ? letter.toUpperCase() : letter;
        }).replace(mozHack, "Moz$1");
    },

    // getComputedStyle takes a pseudoClass as an optional argument, so do we
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
    computeStyle = (node, pseudoElement) => {
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
    },

    injectElement = (node) => {
        if (node && node.nodeType === 1) {
            return node.ownerDocument.head.appendChild(node);
        }
    };

export { each, map, forOwn, filter, is, trim, inArray, invoke, implement, sliceArgs, camelize, computeStyle, injectElement };