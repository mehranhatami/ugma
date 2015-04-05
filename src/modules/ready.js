/**
 * @module ready
 */

import { implement, is  } from "../helpers";
import { DOCUMENT, HTML } from "../const";
import { minErr         } from "../minErr";

var readyCallbacks = [],
    // Supports: IE9+
    // IE have issues were the browser trigger the interactive state before DOMContentLoaded.
    isReady = ( HTML.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/ ).test( DOCUMENT.readyState ),
    pageLoaded;

if ( !isReady )
    DOCUMENT.addEventListener( "DOMContentLoaded", pageLoaded = () => {
        DOCUMENT.removeEventListener("DOMContentLoaded", pageLoaded );
        isReady = 1;
        while ( pageLoaded = readyCallbacks.shift() ) pageLoaded();
    });

implement({
  /**
   * Add a function to execute when the DOM is ready
   * @param {Function} callback event listener
   * @return {Object} The wrapped collection
   * @example
   *     ugma.ready(callback);
   */  
  
    ready: function( fn ) {
        if ( !is( fn, "function") ) minErr("ready()", "The provided 'callback' is not a function.");
       // call imediately when DOM is already ready
        if ( isReady ) {
            fn();
        } else {
             // add to the list
            readyCallbacks.push( fn );
        }
    }
});