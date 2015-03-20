import { DOCUMENT, INTERNET_EXPLORER, ugma } from "../const";
import { each, forOwn } from "../helpers";
// Receive specific events at 60fps, with requestAnimationFrame (rAF).
// http://www.html5rocks.com/en/tutorials/speed/animations/
// NOTE! This feature only for browsers who support rAF, so no
// polyfill needed except for iOS6. But are anyone using that browser?
function DebouncedWrapper(handler, node) {
    var debouncing;
    return (e) => {
        if (!debouncing) {
            debouncing = true;
            node._["<%= prop('raf') %>"] = ugma.requestFrame(function() {
                handler(e);
                debouncing = false;
            });
        }
    };
}
var eventHooks = {};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
forOwn({
    "mouseenter": "mouseover",
    "mouseleave": "mouseout"
}, function(original, fixed) {
    eventHooks[original] = function(handler) {
        // FIXME! It's working, but need to be re-factored
        handler._type = fixed;
        handler.capturing = false;
    };
});

// Support: IE10+
// IE9 doesn't have native rAF, so skip frameevents for
// that browser
if (!INTERNET_EXPLORER || INTERNET_EXPLORER > 9) {
    // Special events for the frame events 'hook'
    each(("resize touchmove mousewheel scroll mousemove drag").split(" "), function(name) {
        eventHooks[name] = DebouncedWrapper;
    });
}

/* istanbul ignore if */
if ("onfocusin" in DOCUMENT.documentElement) {
    eventHooks.focus = (handler) => {
        handler._type = "focusin";
    };
    eventHooks.blur = (handler) => {
        handler._type = "focusout";
    };
} else {
    // firefox doesn't support focusin/focusout events
    eventHooks.focus = eventHooks.blur = (handler) => {
        handler.capturing = true;
    };
}
/* istanbul ignore else */
if (DOCUMENT.createElement("input").validity) {
    eventHooks.invalid = (handler) => {
        handler.capturing = true;
    };
}
/* istanbul ignore if */

export default eventHooks;