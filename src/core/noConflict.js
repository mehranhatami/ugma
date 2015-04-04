/**
 * @module noConflict
 */

import { WINDOW } from "../const";
import { ugma   } from "../core/core";

/*
 * Map over 'ugma' the previous value of the global `ugma` variable, so that it can be restored later on.
 */

var _ugma = WINDOW.ugma;

/**
 * In case another library sets the `ugma` variable before ugma does,
 * this method can be used to return the original `ugma` namespace to that other library.
 *
 * @return {Object} Reference to ugma.
 * @example
 *     var ugma = ugma.noConflict();
 */

ugma.noConflict = () => {
    if ( WINDOW.ugma === ugma ) WINDOW.ugma = _ugma;
    return ugma;
};