/**
 * @module siblings
 */

import { minErr                      } from "../minErr";
import { nodeTree, dummyTree         } from "../core/core";
import   SelectorMatcher               from "../util/selectormatcher";
import { implement, map, filter, is  } from "../helpers";

implement({
    /**
     * Returns all sibling nodes in a collection of children filtered by optional selector
     * @param  {String} [selector] css selector
     * @chainable
     */
    siblings: true,
    /**
     * Returns the first sibling node in a collection of children filtered by index
     * @param  {Number} index child index
     * @chainable
     */
    sibling: false

}, ( methodName, all ) => function( selector ) {

    if ( selector && ( !is( selector, all ? "string" : "number" ) ) ) {
        minErr( methodName + "()", selector + " is not a " + ( all ? " string" : " number" ) + " value" );
    }

    var node = this[ 0 ],
        matcher = SelectorMatcher( selector ),
        siblings = node.parentElement.children;

    if ( all ) {
        if ( matcher ) siblings = filter( siblings, matcher );

        return map(siblings, nodeTree);
    } 
        if ( selector < 0 ) selector = siblings.length + selector;

        return nodeTree( siblings[ selector ] );

}, ( methodName, all ) => () => all ? [] : new dummyTree() );