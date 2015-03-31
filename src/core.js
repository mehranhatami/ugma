/* globals window, document */

import { forOwn } from "./helpers";

var nodeTree, dummyTree, domTree;

function uClass() {
    let len = arguments.length,
        body = arguments[len - 1],
        SuperClass = len > 1 ? arguments[0] : null,
        Class, SuperClassEmpty,

        // helper for merging two object with each other
        extend = (obj, extension, preserve) => {

            // failsave if something goes wrong
            if (!obj || !extension) return obj || extension || {};

            forOwn(extension, (prop, func) => {
                // if preserve is set to true, obj will not be overwritten by extension if
                // obj has already a method key
                obj[prop] = (preserve === false && !(prop in obj)) ? func : func;

                if (preserve && extension.toString !== Object.prototype.toString) {
                    obj.toString = extension.toString;
                }
            });
        };

    if (body.constructor === "[object Object]") {
        Class = () => {};
    } else {
        Class = body.constructor;
        delete body.constructor;
    }

    if (SuperClass) {
        SuperClassEmpty = () => {};
        SuperClassEmpty.prototype = SuperClass.prototype;
        Class.prototype = new SuperClassEmpty();
        Class.prototype.constructor = Class;
        Class.Super = SuperClass;
        extend(Class, SuperClass, false);
    }

    extend(Class.prototype, body);

    return Class;
}

nodeTree = uClass({
    constructor(node) {

            if (this) {
                if (node) {
                    this[0] = node;
                    // use a generated property to store a reference
                    // to the wrapper for circular object binding
                    node["<%= pkg.codename %>"] = this;

                    this._ = {};
                }
            } else {
                // create a wrapper only once for each native element
                return node ? node["<%= pkg.codename %>"] || new nodeTree(node) : new dummyTree();
            }
        },
        // returns current running version
        version: "<%= pkg.version %>",
        // returns current running codename on this build
        codename: "<%= pkg.codename %>",
        toString() { return "<" + this[0].tagName.toLowerCase() + ">" }
});

domTree = uClass(nodeTree, {
    constructor: function(node) {
        return nodeTree.call(this, node.documentElement);
    },
    toString() { return "#document" }
});

dummyTree = uClass(nodeTree, {
    constructor: function() {},
    toString() { return "" }
});

// Set a new document, and define a local copy of ugma
var ugma = new domTree(document);

export { nodeTree, dummyTree, domTree, ugma };