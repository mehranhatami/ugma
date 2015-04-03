/**
 * @module debouncedWrapper
 */

import { ugma } from "../core/core";
import { requestFrame } from "../util/raf";

// Receive specific events at 60fps, with requestAnimationFrame (rAF).
// http://www.html5rocks.com/en/tutorials/speed/animations/
export function DebouncedWrapper( handler, node ) {
    var debouncing;
    return ( e ) => {
        if ( !debouncing ) {
            debouncing = true;
            node._._raf = requestFrame( () => {
                handler( e );
                debouncing = false;
            });
        }
    };
}
