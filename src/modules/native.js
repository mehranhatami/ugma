import { ugma } from "../const";
import { Document, Element } from "../core";

    // Create a ugma wrapper object for a native DOM element or a
    // jQuery element. E.g. (ugma.native($('#foo')[0]))
    ugma.native = (node) => {
        var nodeType = node && node.nodeType;
        // filter non elements like text nodes, comments etc.
        return (nodeType === 9 ?
                Document :
                Element
            )
            (
                nodeType === 1 ||
                nodeType === 9 ?
                node :
                null
            );
    };