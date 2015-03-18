import { DOCUMENT, WINDOW } from "./const";
import { Document, Element, Node } from "./core";

 // jshint unused:false
 // Save a reference to some core methods
 var arrayProto = Array.prototype;

 export const every = arrayProto.every;
 export const slice = arrayProto.slice;
 export const isArray = Array.isArray;
 export const keys = Object.keys;

 // COLLECTION UTILS
 // ----------------

 export function each(array, callback) {
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
  // OBJECT UTILS
  // ------------

 //  Iterates over own enumerable properties of an object, executing 
 //  the callback for each property.
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
     // create a new array with all elements that pass the test implemented by the provided function.
 export function filter(collection, predicate) {
     var result = [];
     forOwn(collection, (index, value) => {
         if (predicate(value, index, collection)) {
             result.push(value);
         }
     });
     return result;
 }

 // DOM UTILS
 // ---------

 // is() returns a boolean for if typeof obj is exactly type.
 export function is(obj, type) {
     // Support: IE11
     // Avoid a Chakra JIT bug in compatibility modes of IE 11.
     // https://github.com/jashkenas/underscore/issues/1621 for more details.
     return type === "function" ?
         typeof obj === type || false :
         typeof obj === type;
 }

 // Support: Android<4.1
 // Make sure we trim BOM and NBSP
 var atrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

 // Support: Android<4.1
 export function trim(text) {
     return text == null ?
         "" :
         (text + "").replace(atrim, "");
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

 export function implement(obj, callback, mixin) {
         if (is(obj, "object")) {
             var proto = (mixin ? Element : Document).prototype;

             if (!callback) {
                 callback = function(method, strategy) {
                     return strategy;
                 };
             }
             forOwn(obj, (method, func) => {
                 var args = [method].concat(func);
                 proto[method] = callback.apply(null, args);

                 if (mixin) {
                     Node.prototype[method] = mixin.apply(null, args);
                 }
             });
         }
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

 export function camelize(prop) {
     return prop && prop.replace(reDash, (_, separator, letter, offset) => {
         return offset ? letter.toUpperCase() : letter;
     }).replace(mozHack, "Moz$1");
 }

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