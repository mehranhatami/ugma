/**
 * @module ready
 */

import { ugma                 } from "../core/core";
import { implement, each, is  } from "../helpers";
import { DOCUMENT, WINDOW     } from "../const";
import { minErr               } from "../minErr";

var callbacks = [],
    readyState = DOCUMENT.readyState,
    pageLoaded = () => {
        //  safely trigger stored callbacks
        if ( callbacks ) callbacks = each( callbacks( ( func ) => ugma.dispatch, ugma) );
    };

callbacks = callbacks.forEach( ugma.dispatch, ugma );

// Support: IE9
if ( DOCUMENT.attachEvent ? readyState === "complete" : readyState !== "loading" ) {
    // use setTimeout to make sure that the dispatch method exists
    WINDOW.setTimeout( pageLoaded, 0 );
} else {
    WINDOW.addEventListener( "load", pageLoaded, false );
    DOCUMENT.addEventListener( "DOMContentLoaded", pageLoaded, false );
}

implement({
    ready: function( callback ) {
        if ( !is( callback, "function") ) minErr();

        if ( callbacks ) {
            callbacks.push( callback );
        } else {
            ugma.dispatch( callback );
        }
    }
});