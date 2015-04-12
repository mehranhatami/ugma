/**
 * @module selectormatcher
 */

import { HTML, VENDOR_PREFIXES } from "../const";
import { is                              } from "../helpers";

// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches

/* es6-transpiler has-iterators:false, has-generators: false */

var quickMatch = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,
    matchesMethod = (function() {
        // matchesSelector has been renamed to matches. Ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches.
        // Ranges of browsers's support. Ref http://caniuse.com/#search=matches
        // So check for the standard method name first
        if (HTML.matches) return "matches";

        // Support: Chrome 34+, Gecko 34+, Safari 7.1, IE10+ (unprefixed)
        if (HTML.matchesSelector) return "matchesSelector";

        // Support: Chome <= 33, IE9, Opera 11.5+ (prefixed)
        var method, prefixes = VENDOR_PREFIXES,
            index = prefixes.length;

        while (index--) {
            method = prefixes[index].toLowerCase() + "MatchesSelector";
            if (HTML[method]) return method;
        }
    })(),
    
    query = ( node, selector ) => {

        // match elem with all selected elems of parent
        var i = 0,
            elems = node.ownerDocument.querySelectorAll( selector ),
            len = elems.length;

        for (; i < len; i++) {
            // return true if match
            if ( elems[ i ] === node ) return true;
        }
        // otherwise return false
        return false;
    };

/*
 * Export interface
 */

export default function(selector, context) {

    if (is(selector, "string")) {

        var matches = quickMatch.exec(selector);

        if (matches) {
            if ( matches[ 1 ] ) matches[ 1 ] = matches[ 1 ].toLowerCase();
            if ( matches[ 3 ] ) matches[ 3 ] = matches[ 3 ].split( "=" );
            if ( matches[ 4 ] ) matches[ 4 ] = " " + matches[ 4 ] + " ";
        }

        return function( node ) {
            var result;

            for (; node && node.nodeType === 1; node = node.parentNode) {
                if (matches) {
                    result = (
                        ( !matches[ 1 ] || node.nodeName.toLowerCase() === matches[ 1 ] ) &&
                        ( !matches[ 2 ] || node.id === matches[ 2 ] ) &&
                        ( !matches[ 3 ] || (matches[ 3 ][ 1 ] ? node.getAttribute( matches[ 3 ][ 0 ] ) === matches[ 3 ][ 1 ] : node.hasAttribute(matches[ 3 ][ 0 ] ) ) ) &&
                        ( !matches[ 4 ] || (" " + node.className + " ").indexOf( matches[ 4 ] ) >= 0 )
                    );
                } else {
                    result = matchesMethod ? node[ matchesMethod ]( selector ) : query( node, selector );
                }

                if (result || !context || node === context) break;
            }

            return result && node;
        };
    }
    return null;
}