/**
 * @module children
 */

import { minErr                          } from "../minErr";
import { implement, Nodes, Shallow       } from "../core/core";
import   SelectorMatcher                   from "../util/selectormatcher";
import { map, filter, is                 } from "../helpers";

implement({
    /**
     * Returns all child nodes in a collection of children filtered by optional selector
     * @param  {String} [selector] css selector
     * @chainable
     * @example
     *     link.children();
     *     link.children('.filter');
     */
    children: true,
    /**
     * Returns the first child node in a collection of children filtered by index
     * @param  {Number} index child index
     * @chainable
     * @example
     *   ul.child(0);  // => the first <li>
     *   ul.child(2);  // => 3th child <li>
     *   ul.child(-1); // => last child <li>     
     */
    child: false

}, ( methodName, all ) => function( selector ) {
    if (selector && ( !is( selector, all ? "string" : "number" ) ) ) {
        minErr( methodName + "()", selector + " is not a " + ( all ? " string" : " number" ) + " value" );
    }

    var node = this[ 0 ],
        matcher = SelectorMatcher( selector ),
        childNodes = node.children;

    if ( all ) {
        if ( matcher ) childNodes = filter( childNodes, matcher );

        return map(childNodes, Nodes);
    } 
        // Avoid negative children, normalize to 0
    if ( selector < 0 ) selector = childNodes.length + selector;

       return Nodes( childNodes[ selector ] );
    
}, ( methodName, all ) => () => all ? [] : new Shallow() );