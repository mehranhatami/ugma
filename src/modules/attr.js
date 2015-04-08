/**
 * @module clone
 */

import { implement      } from "../core/core";
import { is, each       } from "../helpers";
import { RETURN_THIS    } from "../const";

var BOOLEAN_ATTR = {};

each("multiple,selected,checked,disabled,readOnly,required,open".split(","), function(value) {
    BOOLEAN_ATTR[value.toLowerCase()] = value;
});

implement({
    
    /**
     * Get / set attribute on a node
     * @param {String|Object|Array}   value   attribute name
     * @chainable
     * @example
     *     link.attr(); // get
     *     link.attr('attrName', 'attrValue'); // set
     *     link.attr({'attr1', 'value1'}, {'attr2', 'value2}); // set multiple
     */   

    attr(name, value) {

        var node = this[0],
            lowercasedName = name.toLowerCase();
            
        if ( BOOLEAN_ATTR[ lowercasedName ] ) {
            if ( is( value, "defined" ) ) {
                if ( !!value ) {
                    node[ name ] = true;
                    node.setAttribute( name, lowercasedName );
                } else {
                    node[ name ] = false;
                    node.removeAttribute( lowercasedName );
                }
            } else {
                return node[ name ] ? lowercasedName : undefined;
            }
        } else if ( is( value, "defined" ) ) {
            node.setAttribute( name, value );
        } else if ( node.getAttribute ) {
            return ret = node.getAttribute( name );
        }
    }
}, null, () => RETURN_THIS);