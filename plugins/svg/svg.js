/* globals window */

(function(ugma) {

    "use strict";

        if ( !window.ugma ) throw new Error( "Ugma Javascript Framework will need to be included." );
    
    ugma.accessorHooks( { }, "set"); // setter

    ugma.accessorHooks( { }, "get"); // getter


})(window.ugma);