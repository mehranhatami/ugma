/**
 * @module children
 */

import { minErr                      } from "../minErr";
import { nodeTree, dummyTree         } from "../core/core";
import   SelectorMatcher               from "../util/selectormatcher";
import { implement, map, filter, is  } from "../helpers";

implement({
    /**
     * Returns the first child node in a collection of children filtered by index
     * @param  {Number} index
     * @function
     */
    child: false,
    /**
     * eturns all child nodes in a collection of children filtered by optional selector
     * @param  {String} [selector] css selector
     * @function
     */
    children: true

}, ( methodName, all ) => function( selector ) {
    if (selector && (!is(selector, all ? "string" : "number" ) ) ) {
        minErr(methodName + "()", selector + " is not a " + ( all ? " string" : " number" ) + " value" );
    }

    var node = this[ 0 ],
        matcher = SelectorMatcher( selector ),
        children = node.children;

    if ( all ) {
        if ( matcher ) children = filter( children, matcher );

        return map(children, nodeTree);
    } else {
        if ( selector < 0 ) selector = children.length + selector;

        return nodeTree( children[ selector ] );
    }
}, ( methodName, all ) => () => all ? [] : new dummyTree() );