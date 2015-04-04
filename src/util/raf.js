/**
 * @module raf
 */

import { WINDOW } from "../const";

var lastTime = 0,
    requestAnimationFrame =
          WINDOW.requestAnimationFrame             ||
          WINDOW.webkitRequestAnimationFrame       ||
          WINDOW.mozRequestAnimationFrame,
    cancelAnimationFrame = 
          WINDOW.cancelAnimationFrame              ||
          WINDOW.webkitCancelAnimationFrame        ||
          WINDOW.webkitCancelRequestAnimationFrame ||
          WINDOW.mozCancelAnimationFrame,
    requestFrame = requestAnimationFrame ||
      function( callback ) {
        // Dynamically set delay on a per-tick basis to match 60fps.
        var currTime = Date.now(),
            timeDelay = Math.max( 0, 16 - ( currTime - lastTime ) ); // 1000 / 60 = 16.666
        lastTime = currTime + timeDelay;
        return WINDOW.setTimeout( function() {
            callback( Date.now() );
        }, timeDelay );
    },
    cancelFrame = cancelAnimationFrame || 
      function( frameId ) {
        WINDOW.clearTimeout( frameId );
    };

// Works around a rare bug in Safari 6 where the first request is never invoked.
requestFrame( () => () => {} );

/*
 * Export interface
 */

export { requestFrame, cancelFrame };