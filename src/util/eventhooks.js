/**
 * @module eventHooks
 */

import { DOCUMENT, WINDOW, INTERNET_EXPLORER  } from "../const";
import { ugma, implement                      } from "../core/core";
import { each, is, isArray, forOwn            } from "../helpers";
import { debounce                             } from "../util/debounce";

var eventHooks = {};

 // Special events for the frame events 'hook'
    each(("touchmove mousewheel scroll mousemove drag").split(" "), ( name ) => {
        eventHooks[ name ] = debounce;
    });

// Support: Firefox, Chrome, Safari
// Create 'bubbling' focus and blur events

if ("onfocusin" in DOCUMENT.documentElement) {
    eventHooks.focus = ( handler ) => { handler._eventType = "focusin"  };
    eventHooks.blur = ( handler )  => { handler._eventType = "focusout" };
} else {
    // firefox doesn't support focusin/focusout events
    eventHooks.focus = eventHooks.blur = ( handler ) => { handler.capturing = true };
}

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
    DOCUMENT.attachEvent( "onselectionchange", () => {
        if ( capturedNode && capturedNode.value !== capturedNodeValue ) {
            capturedNodeValue = capturedNode.value;
            // trigger custom event that capture
            ugma.native( capturedNode ).trigger( "input" );
        }
    });

    // input event fix via propertychange
    DOCUMENT.attachEvent( "onfocusin", () => {
        capturedNode = WINDOW.event.srcElement;
        capturedNodeValue = capturedNode.value;
    });
}

/**
 * Make 'eventHooks' global
 * Has to use the "implement" API method here, so this will be accessible
 * inside the 'shadow DOM' implementation.
 */
 
 implement({
     
  eventHooks:(  mixin ) => {
      if ( is( mixin, "object" ) && !isArray( mixin ) ) {

          forOwn( mixin, ( key, value ) => {
              if( is( value, "string" ) || is( value, "function" ) )
              eventHooks[ key ] = mixin;
          });
      }
  }
  
 });


/*
 * Export interface
 */

export default eventHooks;