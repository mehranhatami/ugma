import { DOCUMENT, WINDOW } from "./const";
import { Document, Element, Node } from "./core";

 // jshint unused:false
 // Save a reference to some core methods
 var arrayProto = Array.prototype;

 export const every = arrayProto.every;
 export const slice = arrayProto.slice;
 export const isArray = Array.isArray;
 export const keys = Object.keys;

// Invokes the `callback` function once for each item in `arr` collection, which can only 
// be an array.
export function each(arr, callback) {
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
}

// Create a new array with the results of calling a provided function 
// on every element in this array.
export function map(collection, callback) {
    if (collection) {

        var result = [];
        each(collection, (value, key) => {
            result.push(callback(value, key));
        });
        return result;
    }
    return null;
}
export function reduce(array, iteratee, accumulator, initFromArray) {
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

// Iterates over own enumerable properties of an object, executing 
// the callback for each property.
export function forOwn(obj, callback) {
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
    // create a new array with all elements that pass the test implemented 
    // by the provided function.
export function filter(collection, predicate) {
    var result = [];
    forOwn(collection, (index, value) => {
        if (predicate(value, index, collection)) {
            result.push(value);
        }
    });
    return result;
}

// is() returns a boolean for if typeof obj is exactly type.
export function is(obj, type) {
    // Support: IE11
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // https://github.com/jashkenas/underscore/issues/1621 for more details.
    return type === "function" ?
        typeof obj === type || false :
        typeof obj === type;
}

export function isSVG(variable) {
    return WINDOW.SVGElement && (variable instanceof WINDOW.SVGElement);
    }

// Support: Android<4.1
// Make sure we trim BOM and NBSP
var atrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Support: Android<4.1
export function trim(value) {
    return is(value, "string") ? (value + "").replace(atrim, "") : value;
}

export function invoke(context, fn, arg1, arg2) {
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
    }
    // internal method to extend our uClass with methods - either 
    // Element prototype or Document prototype
export function implement(obj, callback, mixin) {

    if (!callback) {
        callback = function(method, strategy) {
            return strategy;
        };
    }

    forOwn(obj, (method, func) => {
        var args = [method].concat(func);
        (mixin ? Element : Document).prototype[method] = callback.apply(null, args);

        if (mixin) {
            Node.prototype[method] = mixin.apply(null, args);
        }
    });
}

// Faster alternative then slice.call
export function convertArgs(arg) {
    var i = arg.length,
        args = new Array(i || 0);
    while (i--) {
        args[i] = arg[i];
    }
    return args;
}

var reDash = /([\:\-\_]+(.))/g,
    mozHack = /^moz([A-Z])/;

// Convert dashed to camelCase
// Support: IE9-11+
export function camelize(prop) {
    return prop && prop.replace(reDash, (_, separator, letter, offset) => {
        return offset ? letter.toUpperCase() : letter;
    }).replace(mozHack, "Moz$1");
}

// getComputedStyle takes a pseudoClass as an optional argument, so do we
// https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
export function computeStyle(node, pseudoElement) {
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

export function injectElement(node) {
    if (node && node.nodeType === 1) {
        return node.ownerDocument.head.appendChild(node);
    }
}