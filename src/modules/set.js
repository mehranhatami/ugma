/**
 * @module set
 */

import { implement                          } from "../core/core";
import { proxy, isArray, each, is, forOwn   } from "../helpers";
import { minErr                             } from "../minErr";
import { RETURN_THIS, SVG                   } from "../const";
import   accessorhooks                        from "../util/accessorhooks";
import   customAttr                           from "../util/customAttr";

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
   *    link.set("innerHTML", "Hello, World!");             // set 'innerHTML'
   *    link.set("textContent", "I'm pure text");           // set 'textContent'
   *    link.set("value", "valueProp");                     // set 'value'
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

        if ( is( name, "string" ) ) {

            /**
             *
             * The National Information Exchange Model (NIEM: http://en.wikipedia.org/wiki/National_Information_Exchange_Model) says to use:
             *
             * -  Upper CamelCase (PascalCase) for elements.
             * -  lower camelCase for attributes.
             */

           var lowercasedName = name.toLowerCase();
           
            // handle executable functions
            if (is(value, "function")) value = value(this);

            if (value == null) {

                if (node[name] && node[name].baseVal) {
                    node[name].baseVal.value = null;
                } else {
                    node.removeAttribute(name);
                }            
            // Grab necessary hook if one is defined
            } else if ( hook ) {
                hook( node, value );
             // Handle everything which isn't a DOM element node
            } else if ( name in node ) { 
                node[ name ] = value;
            // set attribute
            } else {
                // Provides a normalized attribute interface.
                node.setAttribute( lowercasedName, "" + ( customAttr[ value ] || value ) );
            }
            // set array of key values
            // e.g. link.set(["autocomplete", "autocorrect"], "off");
        } else if (isArray( name )) {
            each(name, ( key ) => { this.set(key, value) } );
        // Set the value (with attr map support)
        } else if ( is( name, "object" ) ) {
            forOwn( name, ( key, value ) => { this.set( key, value ) } );
        } else {
            minErr( "set()", "The property or attribute is not valid." );
        }

        // Trigger all relevant attribute / nameerty changes.
        if ( subscription && previousValue !== value )  each( subscription, ( cb ) => { proxy(this, cb, value, previousValue) } );

        return this;
    }
}, null, () => RETURN_THIS );