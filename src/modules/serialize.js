/**
 * @module serialize
 */

import { implement  } from "../core/core";
import { is         } from "../helpers";

implement({

    serialize(node) {

        var result = {};

        if ("form" in node) {
            node = [node];
        } else if ("elements" in node) {
            node = node.elements;
        } else {
            node = [];
        }

        var el, 
            option, 
            name,
            nodeOptions,
            i = 0,
            len = node.length;

        for (; i < len; ) {
            
            el = ( node[ i++ ] );
            
             name = el.name;

            if ( el.disabled || !name ) continue;
/* jshint ignore:start */
            switch ( el.type ) {
                case "select-multiple":

                    result[ name ] = [];

                case "select-one":

                    for ( nodeOptions = ( el.options ), i = 0, len = nodeOptions.length; i < len; ) {
                        option = ( nodeOptions[ i++ ] );
                        if ( option.selected ) {
                            if ( name in result ) {
                                result[ name ].push( option.value );
                            } else {
                                result[ name ] = option.value;
                            }
                        }
                    }

                    break;

                case undefined:
                case "fieldset": // fieldset
                case "file": // file input
                case "submit": // submit button
                case "reset": // reset button
                case "button": // custom button
                    break;

                case "checkbox": // checkbox
                    if ( el.checked && result[ name ] ) {
                        if ( is( result[ name ], "string" ) ) {
                            result[ name ] = [ result[ name] ];
                        }

                        result[ name ].push( el.value );

                        break;
                    }
                case "radio": // radio button
                    if ( !el.checked ) break;
                default:
                    result[ name ] = el.value;
            }
/* jshint ignore:end */
        }

        return result;
    }
});