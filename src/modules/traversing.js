/**
 * @module traversing
 */

import { nodeTree, dummyTree       } from "../core/core";
import SelectorMatcher               from "../util/selectormatcher";
import { implement, is, map        } from "../helpers";
import { minErr                    } from "../minErr";

implement({
    /**
     * Find first element filtered by optional selector
     * @param {String} [selector] css selector
     * @param {Boolean} [andSelf] if true than search will start from the current element
     * @chainable
     */
    first: "firstElementChild",
    /**
     * Find last element filtered by optional selector
     * @param {String} [selector] css selector
     * @param {Boolean} [andSelf] if true than search will start from the current element
     * @chainable
     */
    last: "lastElementChild",
    /**
     * Find next sibling element filtered by optional selector
     * @param {String} [selector] css selector
     * @param {Boolean} [andSelf] if true than search will start from the current element
     * @chainable
     */
    next: "nextElementSibling",
    /**
     * Find previous sibling element filtered by optional selector
     * @param {String} [selector] css selector
     * @param {Boolean} [andSelf] if true than search will start from the current element
     * @chainable
     */
    prev: "previousElementSibling",
    /**
     * Find all next sibling elements filtered by optional selector
     * @param {String} [selector] css selector
     * @param {Boolean} [andSelf] if true than search will start from the current element
     * @chainable
     */
    nextAll: "nextElementSibling",
    /**
     * Find all previous sibling elements filtered by optional selector
     * @param {String} [selector] css selector
     * @param {Boolean} [andSelf] if true than search will start from the current element
     * @chainable
     */
    prevAll: "previousElementSibling",
}, (methodName, propertyName) => function(selector, andSelf) {

    if ( selector && !is( selector, "string" ) ) minErr( methodName + "()", "The provided argument did not match the expected pattern" );

    var all = methodName.slice( -3 ) === "All",
        matcher = SelectorMatcher( selector ),
        descendants = all ? [] : null,
        currentNode = this[ 0 ];

    if (!matcher) currentNode = currentNode[propertyName];

    for (; currentNode; currentNode = currentNode && !andSelf ? currentNode[ propertyName ] : currentNode) {
        if ( currentNode.nodeType === 1 && ( !matcher || matcher( currentNode ) ) ) {
            if ( !all ) break;

            descendants.push( currentNode );
        }
    }

    return all ? map( descendants, nodeTree ) : nodeTree( currentNode );
}, ( methodName ) => () => methodName.slice( -3 ) === "All" ? [] : new dummyTree() );