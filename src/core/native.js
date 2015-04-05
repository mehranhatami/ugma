/**
 * @module native
 */

import { ugma, nodeTree, domTree } from "../core/core";

// Create a ugma wrapper object for a native DOM element or a
// jQuery element. E.g. (ugma.native($('#foo')[0]))
ugma.native = (node) => {
    var nodeType = node && node.nodeType;
    return ( nodeType === 9 ? domTree : nodeTree )( nodeType === 1 || nodeType === 9 ? node : null );
};