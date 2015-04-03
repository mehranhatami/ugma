/**
 * @module raf
 */

import { WINDOW } from "../const";

var lastTime = 0,
    requestAnimationFrame = WINDOW.requestAnimationFrame             ||
                            WINDOW.mozRequestAnimationFrame          ||
                            WINDOW.webkitRequestAnimationFrame,
    cancelAnimationFrame =  WINDOW.cancelAnimationFrame              ||
                            WINDOW.webkitCancelAnimationFrame        ||
                            WINDOW.webkitCancelRequestAnimationFrame,

    requestFrame = ( callback ) => {
        if ( requestAnimationFrame ) {
            return requestAnimationFrame( callback );
        } else {
            // Dynamically set delay on a per-tick basis to match 60fps.
            var currTime = Date.now(),
                timeDelay = Math.max( 0, 16 - ( currTime - lastTime ) ); // 1000 / 60 = 16.666

            lastTime = currTime + timeDelay;

            return WINDOW.setTimeout( () => { callback(currTime + timeDelay) }, timeDelay);
        }
    },
    cancelFrame = ( frameId ) => {
        if ( cancelAnimationFrame ) {
            cancelAnimationFrame( frameId );
        } else {
            WINDOW.clearTimeout( frameId );
        }
    };

// Works around a rare bug in Safari 6 where the first request is never invoked.
requestFrame( () => { return () => {} } );

export { requestFrame, cancelFrame };