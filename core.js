/**
 * @module core
 */

import { DOCUMENT             } from "../const";
import { forOwn, is, isArray  } from "../helpers";
import { minErr               } from "../minErr";
import { RETURN_THIS          } from "../const";

function dummyTree() {}

    function nodeTree(node) {
        if (this instanceof nodeTree) {
            if (node) {
                this[0] = node;
                this._ = {};

                node._ugma = this;

                return this;
            }
        } else {

            return node ? node._ugma || new nodeTree(node) : new dummyTree();
        }
    }

    function domTree(node) {
        // use documentElement for a domTree wrapper
        return nodeTree.call(this, node.documentElement);
    }

    nodeTree.prototype = {
        toString: function() {
            return "<" + this[0].tagName.toLowerCase() + ">";
        }
    };

    dummyTree.prototype = new nodeTree();
    dummyTree.prototype.toString = function() { return "" };

    domTree.prototype = new nodeTree();
    domTree.prototype.toString = function() { return "#document" };

    /**
     * Internal method to extend ugma with methods - either 
     * the nodeTree or the domTree
     */
    var implement = (obj, callback, mixin) => {

            if (!callback) callback = (method, strategy) => strategy;

            forOwn(obj, (method, func) => {
                var args = [method].concat(func);
                (mixin ? nodeTree : domTree).prototype[method] = callback.apply(null, args);

                if (mixin) dummyTree.prototype[method] = mixin.apply(null, args);
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
     * Extend ugma with methods
     * @param  {Object}    mixin       methods container
     * @param  {Boolean|Function} callback 
     * @example
     *
     * ugma.extend({
     *     foo: function() {
     *         console.log("bar");
     *     }
     * });  //  link.foo();
     *
     * ugma.extend({
     *     foo: function() {
     *         console.log("bar");
     *     }
     * }, true); // ugma.foo();
     *
     *
     * Note! The second argument - 'function' - extend the ugma.extend() with similar
     * options as for the *internally* implement method, and let us
     * return e.g. empty object ( {} ), array, booleans, array with values ( arr[1,2,3] )
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