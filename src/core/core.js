/**
 * @module core
 */

import { DOCUMENT    } from "../const";
import { forOwn, is  } from "../helpers";

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
 */

var uClass = () => {

    var len = arguments.length,
        mixin = arguments[ len - 1 ],
        SuperClass = len > 1 ? arguments[ 0 ] : null,
        Class, SuperClassEmpty,
        noop = () => {},
        extend = ( obj, extension, overwrite ) => {

            // failsave if something goes wrong
            if ( !obj || !extension) return obj || extension || {};

            forOwn( extension, ( prop, func ) => {
    
                if ( overwrite === false ) {
                
                   if ( !( prop in obj ) ) obj[ prop ] = func;
                
                } else {
                
                    obj[ prop ] = func;
                }
            });
    };

    if ( is( mixin.constructor, "object" ) ) {
        Class = noop;
    } else {
        Class = mixin.constructor;
        delete mixin.constructor;
    }

    if (SuperClass) {
        SuperClassEmpty = noop;
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
   * Shallow class
  */

Shallow = uClass({
    // dummy function - does nothing
        constructor() {},
        toString() { return "" }
    }),

    /**
     * Nodes class
     */
    Nodes = uClass( Shallow, {
        // Main constructor
        constructor( node ) {

            if ( this ) {

                 this[ 0 ] = node;
                 this._ = {};  
  
                 node._ugma = this;
               
                return this;
            } 

          return node ? node._ugma || new Nodes( node ) : new Shallow();
       },
        toString() { return "<" + this[ 0 ].tagName.toLowerCase() + ">" }
    }),

    /**
     * DOM class
     */
    DOM = uClass( Nodes, {
        constructor( node ) { return DOM.Super.call( this, node.documentElement ) },
            toString() { return "#document" }
    }),
    
    /**
     * Internal method to extend ugma with methods - either 
     * the Nodes or the DOM
     */
    implement = ( obj, callback, mixin ) => {

        if ( !callback ) callback = ( method, strategy ) => strategy;

        forOwn( obj, ( method, func ) => {
            var args = [ method ].concat( func );
            (mixin ? Nodes : DOM).prototype[ method ] = callback.apply( null, args );

            if ( mixin ) Shallow.prototype[ method ] = mixin.apply( null, args );
        });
    },
    
  /**
   * Internal 'instanceOf' method
   */

   // Double negation considered slower than a straight null check.   
   instanceOf = ( node ) => node.constructor && node._ != null;

  // Set a new document, and define a local copy of ugma
    
    var ugma = new  DOM( DOCUMENT );


/*
 * Export interface
 */
export { implement, instanceOf, Nodes, Shallow, DOM, ugma };