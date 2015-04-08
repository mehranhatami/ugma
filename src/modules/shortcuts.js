/**
 * @module shortcuts
 */

import { implement   } from "../core/core";
import { RETURN_THIS } from "../const";

var rreturn = /\r/g;

implement({

    /**
     * Get / set text content of a node
     * @param {String|Object|Array}   value   textContent
     * @chainable
     * @example
     *     link.text('A sunny day!');
     */
    text: "textContent",
    /**
     * Get / set HTML content of a node
     * @param {String|Object|Array}   value   innerHTML content
     * @chainable
     * @example
     *     link.html();
     *     link.html('<span>Hello!</span>');
     */
    html: "innerHTML",
    /**
     * Get / set the value attribute on a node
     * @param {String|Object|Array}   value   attribute name
     * @chainable
     * @example
     *     link.val(); // get
     *     link.val('foo', 'bar'); // set
     */   
    val: "value"
   
}, ( methodName, property ) => function( value ) {

    if ( arguments.length === 0 ) {

        var ret = this.get( property );
        
        if(methodName !== "val") return ret;
        
        // Handle most common string cases
        return ret.replace( rreturn, "" );
    }
    
    this.set( property, value );

}, ( methodName ) => () => () => RETURN_THIS );