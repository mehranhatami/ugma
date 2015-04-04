/**
 * @module clear
 */

import { implement   } from "../helpers";
import { RETURN_THIS } from "../const";

implement({
  /**
   * Clear a property/attribute on the node
   * @param  {String}   name    property/attribute name
   * @chainable
   * @example
   *     link.clear('attrName');
   *     link.clear('propName');
   */

    clear(name) {
       return this.set(name, undefined);
    }

}, null, () => RETURN_THIS);