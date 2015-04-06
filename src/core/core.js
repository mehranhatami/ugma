/**
 * @module core
 */

import { DOCUMENT  } from "../const";
import { forOwn, is, isArray  } from "../helpers";
import { minErr       } from "../minErr";
import { RETURN_THIS  } from "../const";

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
   
   instanceOf = ( node ) => typeof node._ != null;

  // Set a new document, and define a local copy of ugma
    
    var ugma = new domTree( DOCUMENT );

 /**
  * Hook 'eventHooks' on ugma namespace
  */
  ugma.extend = (mixin, namespace) => {
        if( !is( mixin, "object" )  || isArray( mixin ) ) minErr();
        return mixin ? namespace ? implement( mixin ) : implement( mixin, null, () => RETURN_THIS ) : false;
    };

/*
 * Export interface
 */
export { implement, nodeTree, dummyTree, domTree, ugma };