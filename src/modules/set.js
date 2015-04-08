/**
 * @module set
 */

import { implement                          } from "../core/core";
import { invoke, isArray, each, is, forOwn  } from "../helpers";
import { minErr                             } from "../minErr";
import { RETURN_THIS                        } from "../const";
import   accessorhooks                        from "../util/accessorhooks";

 var objectTag = "[object Object]",
     getTagName = ( node ) => {
     var tag = node.tagName;
    return (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "OPTION");
};

implement({
  /**
   * Set property/attribute value by name
   * @param {String|Object|Array}   name    property/attribute name
   * @param {String|Function}       value   property/attribute value or functor
   * @chainable
   * @example 
   *
   *    link.set('attrName', 'attrValue');                  // set
   *    link.set({'attr1', 'value1'}, {'attr2', 'value2});  // object with key-value pairs
   *    link.set("data-fooBar", "foo");                     // set custom attribute data-custom
   *    link.set(["autocomplete", "autocorrect"], "off");   // array of key values
   *    link.set("attrName", null);                         // remove attribute / property value
   *
   * @boolean attributes - example
   *
   *    link.set("checked", checked);    // handle boolean attributes by using name as value ( better performance )
   *    link.set("checked", true);       // set custom attribute data-custom
   */
    set( name, value ) {

        var node = this[ 0 ];
        // getter
        if ( arguments.length === 1 ) {
            if ( is( name, "function" ) ) {
                value = name;
            } else {
                // convert the value to a string
                value = name == null ? "" : "" + name;
            }
           // when `value` is not a 'plain' object
            if ( value !== objectTag ) {

                if ( getTagName( node ) ) {
                    name = "value";
                } else {
                    name = "innerHTML";
                }
            }
        }

        var hook = accessorhooks.set[ name ],
            subscription = ( this._.subscription || {} )[ name ],
            previousValue;

        // grab the previous value if it's already a subscription on this attribute / property,
        if ( subscription ) previousValue = this.get( name );

        if ( is(name, "string" ) ) {

            // handle executable functions
            if (is(value, "function")) value = value( this );

           // use the 'clear()' method here, so we can be 100%
            // sure that we take good care of the boolean attributes
           if ( value == null ) {
               this.clear(name);
            } else if ( hook ) {
                hook( node, value );
            } else if ( name in node ) {
                node[ name ] = value;
            } else {
                // node's attribute
                node.setAttribute( name, value + "" );
            }
            // set array of key values
            // e.g. link.set(["autocomplete", "autocorrect"], "off");
        } else if (isArray( name )) {
            each(name, ( key ) => { this.set(key, value) } );
        // Set the value (with attr map support)
        } else if ( is( name, "object" ) ) {
            forOwn( name, ( key, value ) => { this.set( key, name[ key ] ) } );
        } else {
            minErr( "set()", "The property or attribute is not valid." );
        }

        // Trigger all relevant attribute / nameerty changes.
        if ( subscription && previousValue !== value )  each( subscription, ( cb ) => { invoke(this, cb, value, previousValue) } );

        return this;
    }
}, null, () => RETURN_THIS );