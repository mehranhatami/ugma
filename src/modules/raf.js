import { ugma, WINDOW, VENDOR_PREFIXES } from "../const";
import { each } from "../helpers";

    var global = WINDOW;
    // Test if we are within a foreign domain. Use raf from the top if possible.
    /* jshint ignore:start */
    try {
        // Accessing .name will throw SecurityError within a foreign domain.
        global.top.name;
        global = global.top;
    } catch (e) {}
    /* jshint ignore:end */
    // Works around a iOS6 bug
    var raf = global.requestAnimationFrame,
        craf = global.cancelAnimationFrame,
        lastTime = 0;

    if (!(raf && !craf)) {
        each(VENDOR_PREFIXES, (prefix) => {
            prefix = prefix.toLowerCase();
            raf = raf || WINDOW[prefix + "RequestAnimationFrame"];
            craf = craf || WINDOW[prefix + "CancelAnimationFrame"];
        });
    }

    // Executes a callback in the next frame
    ugma.requestFrame = (callback) => {
        /* istanbul ignore else */
        if (raf) {
            return raf.call(global, callback);
        } else {
            // Dynamically set delay on a per-tick basis to match 60fps.
            var currTime = Date.now(),
                timeDelay = Math.max(0, 16 - (currTime - lastTime)); // 1000 / 60 = 16.666

            lastTime = currTime + timeDelay;

            return global.setTimeout(() => {
                callback(currTime + timeDelay);
            }, timeDelay);
        }
    };

    // Works around a rare bug in Safari 6 where the first request is never invoked.
    ugma.requestFrame(function() {return function() {}});

    // Cancel a scheduled frame
    ugma.cancelFrame = (frameId) => {
        /* istanbul ignore else */
        if (craf) {
            craf.call(global, frameId);
        } else {
            global.clearTimeout(frameId);
        }
    };