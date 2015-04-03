/**
 * @module ready
 */

import { implement, is  } from "../helpers";
import { DOCUMENT, HTML     } from "../const";
import { minErr               } from "../minErr";

var callbacks = [],
    loaded = ( HTML.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/ ).test( DOCUMENT.readyState ),
    pageLoaded;

if ( !loaded )
    DOCUMENT.addEventListener( "DOMContentLoaded", pageLoaded = () => {
        DOCUMENT.removeEventListener("DOMContentLoaded", pageLoaded);
        loaded = 1;
        while ( pageLoaded = callbacks.shift() ) pageLoaded();
    });

implement({
  /**
   * Execute callback when DOM is ready
   * @param {Function} callback event listener
   */
    ready: function( fn ) {
        if ( !is( fn, "function") ) minErr();

        if ( loaded ) {
            fn();
        } else {
            callbacks.push( fn );
        }
    }
});