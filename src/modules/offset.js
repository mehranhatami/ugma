import { implement, is } from "../helpers";
import { WINDOW } from "../const";

function setOffset(elem, options) {

        var node = elem[0],
            position = elem.css("position");

        // Set position first, in-case top/left are set even on static elem
        if (position === "static") {
            node.style.position = "relative";
        }

        var curOffset = elem.offset(),
            curCSSTop = elem.css("top"),
            curCSSLeft = elem.css("left"),
            calculatePosition = (position === "absolute" || position === "fixed") && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1,
            props = {},
            curPosition = {},
            curTop, curLeft;

        // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
        if (calculatePosition) {
            curPosition = elem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;

        } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
        }
        // functor
        if (is(options, "function")) {
            options = options(node, curOffset);
        }

        if (options.top != null) {
            props.top = (options.top - (curOffset ? curOffset.top : 0)) + curTop;
        }
        if (options.left != null) {
            props.left = (options.left - (curOffset ? curOffset.left : 0)) + curLeft;
        }
        elem.css(props);
    }

implement({
    // Calculates offset of the current element
    offset(options) {
        
          if (arguments.length) {
                return options === void 0 ?
                    this : setOffset(this, options);
            }

        var node = this[0],
            docEl = node.ownerDocument.documentElement,
            clientTop = docEl.clientTop,
            clientLeft = docEl.clientLeft,
            scrollTop = WINDOW.pageYOffset || docEl.scrollTop,
            scrollLeft = WINDOW.pageXOffset || docEl.scrollLeft,
            boundingRect = node.getBoundingClientRect();

        // Make sure element is not hidden (display: none) or disconnected
        if (boundingRect.width || boundingRect.height || node.getClientRects().length) {

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
    return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
});