/**
 * @module core
 */

import { DOCUMENT  } from "../const";
import { forOwn, is, isArray  } from "../helpers";
import { minErr       } from "../minErr";
import { RETURN_THIS  } from "../const";

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
 * ugmas main goal is to be as fast as it can, and
 * provide easy solutions to end-devs.
 *
 */


var uClass = () => {

    var len = arguments.length,
        mixin = arguments[ len - 1 ],
        SuperClass = len > 1 ? arguments[ 0 ] : null,
        Class, SuperClassEmpty,
        extend = ( obj, extension, overwrite ) => {

            // failsave if something goes wrong
            if ( !obj || !extension) return obj || extension || {};

            if ( overwrite === false ) {

                forOwn( extension, ( prop, func ) => {
                    if ( !( prop in obj ) ) obj[ prop ] = func;
                });

            } else {

                forOwn( extension, ( prop, func ) => {
                    obj[ prop ] = func;
                });
        }
   };

    if ( is(mixin.constructor, "object") ) {
        Class = () => {};
    } else {
        Class = mixin.constructor;
        delete mixin.constructor;
    }

    if (SuperClass) {
        SuperClassEmpty = () => {};
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

dummyTree = uClass({
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

   // Double negation considered slower than a straight null check.   
   instanceOf = ( node ) => node.constructor && node._ != null;

  // Set a new document, and define a local copy of ugma
    
    var ugma = new domTree( DOCUMENT );

 /**
  * Hook 'eventHooks' on ugma namespace
  */
  ugma.extend = (mixin, callback) => {
      
        if( !is( mixin, "object" )  || isArray( mixin ) ) minErr( "ugma.extend", "The first argument is not a object.");
        
        if(mixin) {
            
            // Extend ...
            if( callback && is(callback, "boolean") ) return implement( mixin );
            
             return implement( mixin, null, !is(callback, "function") ? () => RETURN_THIS : callback );
        }
        
        return false;        
    };

/*
 * Export interface
 */
export { implement, instanceOf, nodeTree, dummyTree, domTree, ugma };