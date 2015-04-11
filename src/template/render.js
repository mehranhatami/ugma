/**
 * @module render
 */

import { ERROR_MSG                 } from "../const";
import { minErr                    } from "../minErr";
import { ugma, Nodes, implement    } from "../core/core";
import   tagCache                    from "../template/template";
import { reduce, is                } from "../helpers";

implement({
     /**
     * Create a new DOM node from Emmet or HTML string in memory
     * @param  {String}       value     Emmet or HTML string
     * @param  {Object|Array} [varMap]  key/value map of variables
     */
    render: "",
    /**
     * Create a new array of Nodes from Emmet or HTML string in memory
     * @param  {String}       value     Emmet or HTML string
     * @param  {Object|Array} [varMap]  key/value map of variables
     * @function
     */    
    renderAll: "All"

}, (methodName, all) => function(value, varMap) {

    // Create native DOM elements
    // e.g. "document.createElement('div')"
    if (value.nodeType === 1) return Nodes(value);

    if (!is(value, "string")) minErr(methodName + "()", "Not supported.");

    var doc = this[0].ownerDocument,
        sandbox = this._.sandbox || (this._.sandbox = doc.createElement("div"));

    var nodes, el;

    if ( value && value in tagCache ) {

        nodes = doc.createElement( value );

        if ( all ) nodes = [ new Nodes( nodes ) ];

    } else {

        value = value.trim();

        // handle vanila HTML strings
        // e.g. <div id="foo" class="bar"></div>
        if (value[ 0 ] === "<" && value[ value.length - 1 ] === ">" && value.length >= 3 ) {

            value = varMap ? ugma.format( value, varMap ) : value;

        } else { // emmet strings
            value = ugma.template( value, varMap );
        }

        sandbox.innerHTML = value; // parse input HTML string

        for ( nodes = all ? [] : null; el = sandbox.firstChild; ) {
            sandbox.removeChild( el ); // detach element from the sandbox

            if (el.nodeType === 1) {

                if ( all ) {
                    nodes.push( new Nodes( el ) );
                } else {
                    nodes = el;

                    break; // stop early, because need only the first element
                }
            }
        }
    }
    return all ? nodes : Nodes( nodes );
});