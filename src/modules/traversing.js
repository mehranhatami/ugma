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
     * @chainable
     * @example
     *    link.first();
     */
    first: "firstElementChild",
    /**
     * Find last element filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     * @example
     *    link.last();
     */
    last: "lastElementChild",
    /**
     * Find next sibling element filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     *    link.next();             
     *    link.next("i"); 
     */
    next: "nextElementSibling",
    /**
     * Find previous sibling element filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     *    link.prev();                       
     *    link.prev("b");                    
     */
    prev: "previousElementSibling",
    /**
     * Find all next sibling elements filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     *    link.prevAll();
     *    link.prevAll("b");
     */
    nextAll: "nextElementSibling",
    /**
     * Find all previous sibling elements filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     *     link.nextAll();
     *     link.nextAll("i");
     */
    prevAll: "previousElementSibling"
    
}, (methodName, propertyName) => function( selector ) {

    if ( selector && !is( selector, "string" ) ) minErr( methodName + "()", "The provided argument did not match the expected pattern" );

    var currentNode = this[ 0 ],
        matcher = SelectorMatcher( selector ),
        all = methodName.slice( -3 ) === "All",
        descendants = all ? [] : null;

    if ( !matcher ) currentNode = currentNode[ propertyName ];

    for (; currentNode; currentNode = currentNode[ propertyName ] ) {
        if ( currentNode.nodeType === 1 && ( !matcher || matcher( currentNode ) ) ) {
            if ( !all ) break;

            descendants.push( currentNode );
        }
    }

    return all ? map( descendants, nodeTree ) : nodeTree( currentNode );
}, ( methodName ) => () => methodName.slice( -3 ) === "All" ? [] : new dummyTree() );