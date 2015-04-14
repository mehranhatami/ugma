/**
 * @module core
 */

import { WINDOW, DOCUMENT    } from "../const";
import { forOwn, is, copy  } from "../helpers";
import   create        from "./create";

function newObject(proto, FN, args) {
    var obj = create(proto);
    if (typeof FN === "function") {
        FN.apply(obj, args);
    }
    return obj;
}
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
var uClass = (Base, info) => {
    if( arguments.len === 1 ){
        info = Base;
        Base = undefined;
    }
    if( arguments.len === 3 ){
        throw new Error("WTF????");
    }
    var proto = Base ? create(Base && Base.prototype) : {};
    //I dont like it, because it makes it a bit slow but ugma has used it extensively this way, all around the code
    //If I were in charge, I would do it another way without messing around with `constructor` keyword
    copy(proto, info, ["constructor"]);

    function instantiate(args){
        return newObject(proto, info.constructor, args);
    }
    function Class() {
        return instantiate(arguments);
    }
    Class.new = function () {
        return instantiate(arguments);
    };
    Class.prototype = proto;
    proto.constructor = Class;
    Class.Super = Base;
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