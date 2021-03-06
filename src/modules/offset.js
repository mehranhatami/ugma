/**
 * @module offset
 */

import { implement  } from "../core/core";
import { WINDOW     } from "../const";

implement({
   /**
    * Calculates offset of the current element
    * @return object with left, top, bottom, right, width and height properties
    * @example
    *     link.offset();
    */
    offset() {

        var node = this[ 0 ],
            docElem = node.ownerDocument.documentElement,
            clientTop = docElem.clientTop,
            clientLeft = docElem.clientLeft,
            scrollTop = WINDOW.pageYOffset || docElem.scrollTop,
            scrollLeft = WINDOW.pageXOffset || docElem.scrollLeft,
            boundingRect = node.getBoundingClientRect();

        return {
            top: boundingRect.top + scrollTop - clientTop,
            left: boundingRect.left + scrollLeft - clientLeft,
            right: boundingRect.right + scrollLeft - clientLeft,
            bottom: boundingRect.bottom + scrollTop - clientTop,
            width: boundingRect.right - boundingRect.left,
            height: boundingRect.bottom - boundingRect.top
        };
    }
   
}, null, (methodName) => () => { return methodName === "offset" ? { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 } : 0 } );