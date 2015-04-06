/**
 * @module debounce
 */

import { ugma } from "../core/core";
import { requestFrame } from "../util/raf";

// Receive specific events at 60fps, with requestAnimationFrame (rAF).
// http://www.html5rocks.com/en/tutorials/speed/animations/
function debounce( handler, node ) {
    var debouncing;
    return ( e ) => {
        if ( !debouncing ) {
            debouncing = true;
            node._.raf = requestFrame( () => {
                handler( e );
                debouncing = false;
            });
        }
    };
}

/*
 * Export interface
 */

export { debounce };
