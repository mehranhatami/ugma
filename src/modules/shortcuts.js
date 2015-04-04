/**
 * @module shortcuts
 */

import { implement   } from "../helpers";
import { RETURN_THIS } from "../const";

implement({

    /**
     * Get / set text content of a node
     * @param  {String}   value   
     */
    text: "textContent",
    /**
     * Get / set HTML content of a node
     * @param  {String}   value   
     */
    html: "innerHTML",
    /**
     * Get / set the value attribute on a node
     * @param  {String}   value 
     */
    attr: "attribute",
}, ( methodName, propertyName ) => function( value ) {

    if ( arguments.length === 0 ) {
        return this.get( methodName );
    }
    this.set( methodName, value );

}, ( methodName ) => () => () => RETURN_THIS );