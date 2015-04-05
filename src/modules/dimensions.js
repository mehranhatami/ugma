/**
 * @module dimensions
 */

import { implement   } from "../helpers";

implement({

  /**
   * Calculate element's width in pixels
   * @return {Number} element width in pixels
   * @chainable
   */    
   width: "",
   /**
    * Calculate element's height in pixels
    * @return {Number} element height in pixels
    */    
    height: "",
   
}, ( methodName ) => function( value ) {

    if ( arguments.length === 0 ) {
        return this.offset()[ methodName ];
    }
    this.css(methodName, value );

}, () => () => () => {} );