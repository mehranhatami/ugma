/**
 * @module subscription
 */

import { implement, filter } from "../helpers";
import { RETURN_THIS       } from "../const";

implement({
  /**
   * Subscribe on particular properties / attributes, and get notified if they are changing
   * @param  {String}   name     property/attribute name
   * @param  {Function}  callback  function for notifying about changes of the property/attribute
   * @chainable
   */
    subscribe(name, callback) {
            var subscription = this._._subscription || ( this._._subscription = [] );

            if ( !subscription[ name ]) subscription[ name ] = [];

            subscription[ name ].push( callback );

            return this;
        },
 /**
  * Cancel / stop a property / attribute subscription
  * @param  {String}   name    property/attribute name
  * @param  {Function}  callback  function for notifying about changes of the property/attribute
  * @chainable
  */
   unsubscribe(name, callback) {
            var subscription = this._._subscription;

            if ( subscription[ name ] ) subscription[ name ] = filter( subscription[ name ], ( cb ) => cb !== callback );

            return this;
        }
}, null, () => RETURN_THIS );