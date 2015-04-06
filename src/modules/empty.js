/**
 * @module empty
 */

import { implement       } from "../core/core";
import { RETURN_THIS     } from "../const";

implement({
  /**
    * Remove child nodes of current element from the DOM
    * @chainable
    * @example
    *    link.empty();
    */
    empty() { return this.set( "" ) }
}, null, () => RETURN_THIS);