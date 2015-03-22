import { implement } from "../helpers";
import { RETURN_THIS } from "../const";

implement({
    // returns the first child node in a collection of children
    width: "Width",
    // returns all child nodes in a collection of children
    height: "Height"

}, (methodName, property) => function(value) {
    var doc,
        node = this[0],
        boundingRect = node.getBoundingClientRect();
    // Get document width or height
    if (node.nodeType === 9) {
        doc = node.documentElement;

        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
        // whichever is greatest
        return Math.max(
            node.body["scroll" + property], doc["scroll" + property],
            node.body["offset" + property], doc["offset" + property],
            doc["client" + property]
        );
    }
    // Make sure element is not hidden (display: none) or disconnected
    if (boundingRect.width || boundingRect.height || node.getClientRects().length) {
        // Get width or height on the element
        if (!value) {
            return boundingRect[methodName];
        }

        // Set width or height on the element
        this.css(methodName, value);
    }
}, () => ()  => null);
