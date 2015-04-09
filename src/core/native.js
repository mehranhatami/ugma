/**
 * @module native
 */

import { Nodes, DOM, implement } from "../core/core";

implement({

    /**
     * Create a wrapper object for a native DOM element or a jQuery element.
     * @param {Object}  [node]  native element
     * @return {Nodes} a wrapper object
     * @example
     *
     *   ugma.native(document.body);  // using the 'ugma' document
     *  
     *  ugma.native( $("#foo") )  // using 'ugma' document and wrap a jQuery object
     *
     * NOTE! If you create a .shadow(), this API method will
     * create wrapper objects that will only be accessible inside
     * the newly created .shadow() and not in other DOM trees.
     */
     
    native( node ) {
        var nodeType = node && node.nodeType;
        return ( nodeType === 9 ? DOM : Nodes )( nodeType === 1 || nodeType === 9 ? node : null );
    }
});