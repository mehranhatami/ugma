/**
 * @module version
 */

import { implement    } from "../core/core";
import { is, isArray  } from "../helpers";
import { RETURN_THIS  } from "../const";
import { minErr       } from "../minErr";

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
  implement({
  
    extend(mixin, callback) {
      
        if( !is( mixin, "object" )  || isArray( mixin ) ) minErr( "ugma.extend", "The first argument is not a object.");
        
        if(mixin) {
            
            // Extend ...
            if( callback && is(callback, "boolean") ) return implement( mixin );
            
             return implement( mixin, null, !is(callback, "function") ? () => RETURN_THIS : callback );
        }
        
        return false;        
    }
  });

