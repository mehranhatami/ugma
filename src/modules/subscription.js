/**
 * @module subscription
 */

import { implement     } from "../core/core";
import { filter        } from "../helpers";
import { RETURN_THIS   } from "../const";

implement({
  /**
   * Subscribe on particular properties / attributes, and get notified if they are changing
   * @param  {String}   name     property/attribute name
   * @param  {Function}  fn  function for notifying about changes of the property/attribute
   * @chainable
   * @example
   *     link.subscribe("value", function(value, oldValue) { });
   */
    subscribe( name, fn ) {
            var subscription = this._.subscription || ( this._.subscription = [] );

            if ( !subscription[ name ] ) subscription[ name ] = [];

            subscription[ name ].push( fn );

            return this;
        },
 /**
  * Cancel / stop a property / attribute subscription
  * @param  {String}   name    property/attribute name
  * @param  {Function}  fn  function for notifying about changes of the property/attribute
  * @chainable
  * @example
  *     link.unsubscribe("value", function(value, oldValue) { });
  */
   unsubscribe(name, fn) {
            var subscription = this._.subscription;

            if ( subscription[ name ] ) subscription[ name ] = filter( subscription[ name ], ( callback ) => callback !== fn );

            return this;
        }
}, null, () => RETURN_THIS );