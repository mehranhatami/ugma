/**
 * @module eventHooks
 */

import { DOCUMENT, WINDOW, INTERNET_EXPLORER  } from "../const";
import { ugma                                 } from "../core/core";
import { each                                 } from "../helpers";
import { DebouncedWrapper                     } from "../util/DebouncedWrapper";

var eventHooks = {};

 // Special events for the frame events 'hook'
    each(("touchmove mousewheel scroll mousemove drag").split(" "), ( name ) => {
        eventHooks[ name ] = DebouncedWrapper;
    });

// Support: Firefox, Chrome, Safari
// Create 'bubbling' focus and blur events

if ("onfocusin" in DOCUMENT.documentElement) {
    eventHooks.focus = ( handler ) => { handler._eventType = "focusin" };
    eventHooks.blur = ( handler ) => { handler._eventType = "focusout" };
} else {
    // firefox doesn't support focusin/focusout events
    eventHooks.focus = eventHooks.blur = ( handler ) => { handler.capturing = true };
}
/* istanbul ignore else */
if (DOCUMENT.createElement( "input" ).validity) {
    eventHooks.invalid = ( handler ) => {
        handler.capturing = true;
    };
}
// Support: IE9
if (INTERNET_EXPLORER < 10) {

    var capturedNode, capturedNodeValue;

    // IE9 doesn't fire oninput when text is deleted, so use
    // onselectionchange event to detect such cases
    // http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
    DOCUMENT.attachEvent("onselectionchange", () => {
        if (capturedNode && capturedNode.value !== capturedNodeValue) {
            capturedNodeValue = capturedNode.value;
            // trigger custom event that capture
            ugma.native( capturedNode ).trigger( "input" );
        }
    });

    // input event fix via propertychange
    DOCUMENT.attachEvent("onfocusin", () => {
        capturedNode = WINDOW.event.srcElement;
        capturedNodeValue = capturedNode.value;
    });
}

/* istanbul ignore if */

export default eventHooks;