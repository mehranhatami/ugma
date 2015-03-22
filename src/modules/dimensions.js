import { implement } from "../helpers";
import { RETURN_THIS } from "../const";

implement({
    width: "Width",
    height: "Height"
}, (methodName, property) => function(value) {

    var doc,
        node = this[0],
        boundingRect = node.getBoundingClientRect();

    // Make sure element is not hidden (display: none) or disconnected
    if (boundingRect.width || boundingRect.height || node.getClientRects().length) {
        // Get width or height on the element
        if (!value) {
            return boundingRect[methodName];
        }

        // Set width or height on the element
        this.css(methodName, value);
    }
}, () => () => null);