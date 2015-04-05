/**
 * @module data
 */

import { implement, forOwn, map, is, isArray  } from "../helpers";
import { RETURN_THIS                          } from "../const";
import { readData                             } from "../util/readData";

implement({
  /**
   * Getter/setter of a data entry value. Tries to read the appropriate
   * HTML5 data-* attribute if it exists
   * @param  {String|Object|Array}  key(s)  data key or key/value object or array of keys
   * @param  {Object}               [value] data value to store
   * @return {Object} data entry value or this in case of setter
   * @chainable
   * @example
   *     link.data('foo'); // get
   *     link.data('bar', {any: 'data'}); // set
   */   
    data( key, value ) {
        
        var len = arguments.length;
        
        // getter
        if ( len === 1 ) {
            if ( is( key, "string" ) ) {

                var data = this._;
                // If no data was found internally, try to fetch any
                // data from the HTML5 data-* attribute
                if ( !( key in data ) ) data[ key ] = readData( this[ 0 ], "data-" + key );

                return data && data[ key ]; // data('key')
                
            // Set the value (with attr map support)
            } else if ( key && is( key, "object" ) ) {
             
                if ( isArray( key ) ) return this.data( map(key, ( key ) => key ) );
                  // mass-setter: data({key1: val1, key2: val2})
                  return forOwn( key, ( key, value ) => {
                        this.data( key, value );
                   });
            }
        } 
         // setter   
        if ( len === 2 ) {
            // delete the private property if the value is 'null' or 'undefined'
            if ( value === null || value === undefined ) {
                delete this._[ key ];
            } else {
                this._[ key ] = value; // data('key', value)
            }
        }
        return this;
    }
}, null, () => RETURN_THIS );