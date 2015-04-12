/**
 * @module contains
 */

import { implement             } from "../core/core";
import { WINDOW, RETURN_FALSE  } from "../const";

implement({
 /**
  * Scrolls the window so that the `element` appears at the top of the viewport.
  * @example
  * 
  *  link.scrollTo();
  *   // -> Element 
  * 
  *  link.scrollTo(20, 100);
  *   // -> Element 
  */
    scrollTo(x, y) {
      
      var offset = this.offset();
      
      WINDOW.scrollTo(x || offset.left, y || offset.top);

    }
}, null, () => RETURN_FALSE);