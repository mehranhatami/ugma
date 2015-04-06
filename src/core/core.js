/**
 * @module core
 */

import { DOCUMENT  } from "../const";
import { forOwn    } from "../helpers";
import   uClass      from "../core/uClass";

var nodeTree, dummyTree, domTree,
    
    /**
     * Internal method to extend ugma with methods - either 
     * the nodeTree or the domTree
     */ 
    implement = ( obj, callback, mixin ) => {

        if ( !callback ) callback = ( method, strategy ) => strategy;

        forOwn(obj, ( method, func ) => {
            var args = [ method ].concat( func );
            ( mixin ? nodeTree : domTree ).prototype[ method ] = callback.apply( null, args );

            if ( mixin ) dummyTree.prototype[ method ] = mixin.apply( null, args );
        });
    },
    /**
     * Internal 'instanceOf' method
     */
    instanceOf = (node) => typeof node._ != null;

/**
 * nodeTree class
 */
nodeTree = uClass({
    constructor(node) {

            if (this) {
                if (node) {
                    this[0] = node;
                    // use a generated property to store a reference
                    // to the wrapper for circular object binding
                    node._ugma = this;

                    this._ = {};
                }
            } else {
                // create a wrapper only once for each native element
                return node ? node._ugma || new nodeTree(node) : new dummyTree();
            }
        },
        toString() { return "<" + this[0].tagName.toLowerCase() + ">" }
});

/**
 * domTree class
 */
domTree = uClass(nodeTree, {
    constructor(node) { return nodeTree.call(this, node.documentElement) },
    toString() { return "#document" }
});

/**
 * dummyTree class
 */

dummyTree = uClass(nodeTree, {
    constructor() {},
    toString() { return "" }
});

// Set a new document, and define a local copy of ugma
var ugma = new domTree(DOCUMENT);

/*
 * Export interface
 */
export { implement, nodeTree, dummyTree, domTree, ugma };