/**
 * @module ready
 */

import { implement, is  } from "../helpers";
import { DOCUMENT, HTML } from "../const";
import { minErr         } from "../minErr";

var readyCallbacks = [],
    // Supports: IE9+
    // IE have issues were the browser trigger the interactive state before DOMContentLoaded.
    loaded = ( HTML.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/ ).test( DOCUMENT.readyState ),
    pageLoaded;



if ( !loaded )
    DOCUMENT.addEventListener( "DOMContentLoaded", pageLoaded = () => {
        DOCUMENT.removeEventListener("DOMContentLoaded", pageLoaded);
        loaded = 1;
        while ( pageLoaded = readyCallbacks.shift() ) pageLoaded();
    });

implement({
  /**
   * Execute callback when DOM is ready
   * @param {Function} callback event listener
   */
    ready: function( fn ) {
        if ( !is( fn, "function") ) minErr("ready()", "The provided 'callback' is not a function.");

        if ( loaded ) {
            fn();
        } else {
            readyCallbacks.push( fn );
        }
    }
});