
// Export internal API functions in the `ugma` namespace

import { implement                } from "../core/core";
import { camelize, computeStyle   } from "../helpers";
import { deserializeValue         } from "../util/readData";
  
  // All API functions we want expose to the 'ugma namespace', or
  // the .shadow() DOM trees, we list here

implement({
      camelize: camelize,
      computeStyle: computeStyle,
      deserializeValue: deserializeValue,
  });