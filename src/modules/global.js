
// Export internal API functions in the `ugma` namespace

import { ugma                              } from "../core/core";
import { camelize, computeStyle, proxy, is } from "../helpers";
import { deserializeValue                          } from "../util/readData";
  
  // All methods we want to hook on the 'ugma namespace' we list here
  
  ugma.camelize                 = camelize;
  ugma.computeStyle             = computeStyle;
  ugma.proxy                    = proxy;
  ugma.deserializeValue         = deserializeValue;
  