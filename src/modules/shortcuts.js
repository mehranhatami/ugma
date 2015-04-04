/**
 * @module shortcuts
 */

import { implement   } from "../helpers";
import { RETURN_THIS } from "../const";

implement({

    /**
     * Get / set text content of a node
     * @param {String|Object|Array}   value   textContent
     * @chainable
     * @example
     *     link.text('New content');
     */
    text: "textContent",
    /**
     * Get / set HTML content of a node
     * @param {String|Object|Array}   value   innerHTML content
     * @chainable
     * @example
     *     link.html();
     *     link.html('<span>more</span>');
     */
    html: "innerHTML",
    /**
     * Get / set the value attribute on a node
     * @param {String|Object|Array}   value   attribute name
     * @chainable
     * @example
     *     link.attr('attrName'); // get
     *     link.attr('attrName', 'attrValue'); // set
     *     link.attr({'attr1', 'value1'}, {'attr2', 'value2}); // set multiple
     */   
    attr: "attribute",
   
}, ( methodName, property ) => function( value ) {

    if ( arguments.length === 0 ) {
        return this.get( property );
    }
    this.set( property, value );

}, ( methodName ) => () => () => RETURN_THIS );