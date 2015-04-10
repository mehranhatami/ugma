
// Export internal API functions in the `ugma` namespace

import { implement                           } from "../core/core";
import { camelize, computeStyle, proxy, is   } from "../helpers";
import { deserializeValue                    } from "../util/readData";
import { minErr                              } from "../minErr";
  
  // All API functions we want expose to the 'ugma namespace', or
  // the .shadow() DOM trees, we list here

implement({
      minErr: minErr,
      camelize: camelize,
      computeStyle: computeStyle,
      proxy: proxy,
      deserializeValue: deserializeValue,
  });