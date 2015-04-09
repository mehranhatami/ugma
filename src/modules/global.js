/*
 * Expose some internal methods to the global ugma namespace
 */


import { ugma                              } from "../core/core";
import { camelize, computeStyle, proxy, is } from "../helpers";

  ugma.camelize  = camelize;
  ugma.computeStyle  = computeStyle;
  ugma.proxy     = proxy;