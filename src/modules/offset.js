import { implement } from "../helpers";
import { WINDOW } from "../const";

implement({
    // Calculates offset of the current element
    offset() {
        var node = this[0],
            docEl = node.ownerDocument.documentElement,
            clientTop = docEl.clientTop,
            clientLeft = docEl.clientLeft,
            scrollTop = WINDOW.pageYOffset || docEl.scrollTop,
            scrollLeft = WINDOW.pageXOffset || docEl.scrollLeft,
            boundingRect = node.getBoundingClientRect();

        // Make sure element is not hidden (display: none) or disconnected
        if (boundingRect.width ||
            boundingRect.height ||
            boundingRect.length) {

            return {
                top: boundingRect.top + scrollTop - clientTop,
                left: boundingRect.left + scrollLeft - clientLeft,
                right: boundingRect.right + scrollLeft - clientLeft,
                bottom: boundingRect.bottom + scrollTop - clientTop,
                width: boundingRect.right - boundingRect.left,
                height: boundingRect.bottom - boundingRect.top
            };
        }
    }
}, null, () => function() {
    return {
        top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
});