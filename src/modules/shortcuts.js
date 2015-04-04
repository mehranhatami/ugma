/**
 * @module shortcuts
 */

import { implement   } from "../helpers";
import { RETURN_THIS } from "../const";

implement({

    /**
     * Get / set text content of a node
     * @param  {String}   value   
     * @chainable
     * @example
     *     link.html();
     *     link.html('<span>more</span>');
     */
    text: "textContent",
    /**
     * Get / set HTML content of a node
     * @param  {String}   value   
     * @chainable
     * @example
     *     link.text('New content');
     */
    html: "innerHTML",
    /**
     * Get / set the value attribute on a node
     * @param  {String}   value 
     * @chainable
     * @example
     *     link.html();
     *     link.html('<span>more</span>');
     */
   attr: "attribute",
}, ( methodName, property ) => function( value ) {

    if ( arguments.length === 0 ) {
        return this.get( property );
    }
    this.set( property, value );

}, ( methodName ) => () => () => RETURN_THIS );