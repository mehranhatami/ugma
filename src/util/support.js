/**
 * @module support
 */

import { ugma     } from "../core/core";
import { DOCUMENT } from "../const";

  var support = {};

  support.classList = !!DOCUMENT.createElement("div").classList;
  
  /**
    Expose 'support' to the ugma namespace
  */
  
  ugma.support = support;
  

export default support;