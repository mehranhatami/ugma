/**
 * @module map
 */

import { implement  } from "../core/core";
import { minErr     } from "../minErr";
import { is         } from "../helpers";

implement({
  /**
     * Invokes a function for element if it's not empty and return array of results
     * @param  {Function}  fn         function to invoke
     * @param  {Object}    [context]  execution context
     * @return {Array} an empty array or array with returned value
     */
    map( fn, context ) {
        if ( !is( fn, "function" ) ) minErr( "map()", "This operation is not supported" );
        return [ fn.call( ( context ), this) ];
    }
}, null, () => () => [] );