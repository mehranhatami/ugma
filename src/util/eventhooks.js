import { DOCUMENT, WINDOW, INTERNET_EXPLORER } from "../const";
import { ugma } from "../core";
import { each, forOwn } from "../helpers";
import { DebouncedWrapper } from "../util/DebouncedWrapper";

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
    each(("touchmove mousewheel scroll mousemove drag").split(" "), function(name) {
        eventHooks[name] = DebouncedWrapper;
    });
}
// Support: Firefox, Chrome, Safari
// Create 'bubbling' focus and blur events

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
// Support: IE9
if (INTERNET_EXPLORER < 10) {

    var capturedNode, capturedNodeValue;

    // IE9 doesn't fire oninput when text is deleted, so use
    // onselectionchange event to detect such cases
    // http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
    DOCUMENT.attachEvent("onselectionchange", function() {
        if (capturedNode && capturedNode.value !== capturedNodeValue) {
            capturedNodeValue = capturedNode.value;
            // trigger custom event that capture
            ugma.native(capturedNode).fire("input");
        }
    });

    // input event fix via propertychange
    DOCUMENT.attachEvent("onfocusin", function() {
        capturedNode = WINDOW.event.srcElement;
        capturedNodeValue = capturedNode.value;
    });
}

/* istanbul ignore if */

export default eventHooks;