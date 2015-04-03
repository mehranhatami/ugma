/**
 * @module map
 */

import { minErr        } from "../minErr";
import { implement, is } from "../helpers";

implement({
    // Invokes a function for element if it's not empty and return array of results
    map( fn, context ) {
        if ( !is( fn, "function" ) ) minErr("map()", "This operation is not supported" );
        return [ fn.call( ( context ), this) ];
    }
}, null, () => () => [] );