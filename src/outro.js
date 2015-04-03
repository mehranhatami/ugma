/**
 * @module outro
 */

import { WINDOW } from "./const";
import { ugma   } from "./core/core";

// Map over 'ugma' in case of overwrite
var _ugma = WINDOW.ugma;

// Runs ugma in *noConflict* mode, returning the original `ugma` namespace.
ugma.noConflict = function() {
    if ( WINDOW.ugma === ugma ) {
        WINDOW.ugma = _ugma;
    }

    return ugma;
};

WINDOW.ugma = ugma;