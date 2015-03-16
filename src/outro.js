import { ugma, WINDOW } from "./const";

// Map over 'ugma' in case of overwrite
var _ugma = WINDOW.ugma;

// Runs ugma in *noConflict* mode, returning the original `ugma` namespace.
ugma.noConflict = function() {
    if (WINDOW.ugma === ugma) {
        WINDOW.ugma = _ugma;
    }

    return ugma;
};

WINDOW.ugma = ugma;