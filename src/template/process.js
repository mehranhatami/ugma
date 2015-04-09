/**
 * @module process
 */

import { is, each     }   from "../helpers";
import { minErr       }   from "../minErr";
import { parseAttr    }   from "../template/parseAttr";
import { replaceAttr  }   from "../template/replaceAttr";
import { processTag   }   from "../template/processTag";
import { multiple     }   from "../template/multiple";
import operators          from "../template/operators";

/* es6-transpiler has-iterators:false, has-generators: false */

var attributes = /\s*([\w\-]+)(?:=((?:`([^`]*)`)|[^\s]*))?/g,
    charMap = { 
        "&": "&amp;",    // ampersand
        "<": "&lt;",     // less-than
        ">": "&gt;",     // greater-than
        "\"": "&quot;", 
        "'": "&#039;",
        "¢": "&#162;",   // cent
        "¥": "&#165;",   // yen
        "§": "&#167;",   // section
        "©": "&#169;",   // copyright
        "®": "&#174;",   // registred trademark
        "™": "&#8482;",  // trademark
    },
    // filter for escaping unsafe XML characters: <, >, &, ', " and
    // prevent XSS attacks
    escapeChars = ( str ) => {
       // always make sure the'str' argument is a string, in a few 'rare' 
       // cases it could be an array, and ugma will throw
       return is( str, "string" ) && str.replace( /[&<>"'¢¥§©®™]/g, ( ch ) => charMap[ ch ] );
    },
    process = ( template ) => {

    let stack = [];

    each( template, ( str ) => {

        if ( str in operators ) {

            let value = stack.shift(),
                node = stack.shift();

            if ( is( node, "string" ) ) node = [ processTag( node ) ];

            if ( is( node, "undefined" ) || is( value, "undefined" ) ) minErr( "ugma.render()", "This operation is not supported" );

            if ( str === "#" ) { // id
                value = replaceAttr(" id=\"" + value + "\"" );
            } else if ( str === "." ) { // class
                value = replaceAttr(" class=\"" + value + "\"" );
            } else if ( str === "[" ) { // id
                value = replaceAttr( value.replace( attributes, parseAttr ) );
            } else if ( str === "*" ) { // universal selector 
                node = multiple( +value, node.join( "" ) );
            } else if ( str === "`" ) { // Back tick
                stack.unshift(node);
                // escape unsafe HTML symbols
                node = [ escapeChars( value ) ];
            } else { /* ">", "+", "^" */
                value = is( value, "string" ) ? processTag( value ) : value.join( "" );

                if ( str === ">" ) {
                    value = replaceAttr( value, true );
                } else {
                    node.push( value );
                }
            }

            str = is( value, "function" ) ? node.map( value ) : node;
        }

        stack.unshift( str );
    });

    return template.length === 1 ? processTag( stack[ 0 ] ) : stack[ 0 ].join( "" );
};

/*
 * Export interface
 */

export { process };