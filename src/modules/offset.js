/**
 * @module offset
 */

import { implement } from "../helpers";
import { WINDOW    } from "../const";

implement({
   /**
    * Calculates offset of the current element
    * @return object with left, top, bottom, right, width and height properties
    * @example
    *     link.offset();
    */
    offset() {

        var node = this[ 0 ],
            docEl = node.ownerDocument.documentElement,
            clientTop = docEl.clientTop,
            clientLeft = docEl.clientLeft,
            scrollTop = WINDOW.pageYOffset || docEl.scrollTop,
            scrollLeft = WINDOW.pageXOffset || docEl.scrollLeft,
            boundingRect = node.getBoundingClientRect();

        return {
            top: boundingRect.top + scrollTop - clientTop,
            left: boundingRect.left + scrollLeft - clientLeft,
            right: boundingRect.right + scrollLeft - clientLeft,
            bottom: boundingRect.bottom + scrollTop - clientTop,
            width: boundingRect.right - boundingRect.left,
            height: boundingRect.bottom - boundingRect.top
        };
    },

  /**
   * Calculate width based on element's offset
   * @return {Number} element width in pixels
   */    
   width() { return this.offset().width },
 
  /**
   * Calculate height based on element's offset
   * @return {Number} element height in pixels
   */
   height() { return this.offset().height }
   
}, null, (methodName) => () => { return methodName === "offset" ? { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 } : 0 } );