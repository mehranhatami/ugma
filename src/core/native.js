/**
 * @module native
 */

import { ugma, Nodes, DOM } from "../core/core";

// Create a ugma wrapper object for a native DOM element or a
// jQuery element. E.g. (ugma.native($('#foo')[0]))
ugma.native = (node) => {
    var nodeType = node && node.nodeType;
    return ( nodeType === 9 ? DOM : Nodes )( nodeType === 1 || nodeType === 9 ? node : null );
};