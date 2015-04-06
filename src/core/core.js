/**
 * @module core
 */

import { DOCUMENT  } from "../const";
import { forOwn    } from "../helpers";
import   uClass      from "../core/uClass";

  /**
   * dummyTree class
  */
var dummyTree = uClass({
        constructor() {},
        toString() { return "" }
    }),

    /**
     * nodeTree class
     */
    nodeTree = uClass( dummyTree, {
        // Main constructor
        constructor( node ) {

            if ( this ) {

                 this[ 0 ] = node;
                 this._ = {};  
  
                 node._ugma = this;
               
                return this;
            } 

          return node ? node._ugma || new nodeTree( node ) : new dummyTree();
       },
        toString() { return "<" + this[ 0 ].tagName.toLowerCase() + ">" }
    }),

    /**
     * domTree class
     */
    domTree = uClass( nodeTree, {
        constructor( node ) { return domTree.Super.call( this, node.documentElement ) },
            toString() { return "#document" }
    }),
    
    /**
     * Internal method to extend ugma with methods - either 
     * the nodeTree or the domTree
     */
    implement = ( obj, callback, mixin ) => {

        if ( !callback ) callback = ( method, strategy ) => strategy;

        forOwn( obj, ( method, func ) => {
            var args = [ method ].concat( func );
            (mixin ? nodeTree : domTree).prototype[ method ] = callback.apply( null, args );

            if ( mixin ) dummyTree.prototype[ method ] = mixin.apply( null, args );
        });
    },
    
  /**
   * Internal 'instanceOf' method
   */
   
   instanceOf = ( node ) => typeof node._ != null;

// Set a new document, and define a local copy of ugma
var ugma = new domTree( DOCUMENT );

/*
 * Export interface
 */
export { implement, nodeTree, dummyTree, domTree, ugma };