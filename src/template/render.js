/**
 * @module render
 */

import { ERROR_MSG                         } from "../const";
import { minErr                            } from "../minErr";
import { ugma, nodeTree                    } from "../core/core";
import   tagCache                            from "../template/template";
import { implement, reduce, is, trim       } from "../helpers";

implement({
     /**
     * Create a new nodeTree from Emmet or HTML string in memory
     * @param  {String}       value     Emmet or HTML string
     * @param  {Object|Array} [varMap]  key/value map of variables
     */
    render: "",
    /**
     * Create a new array of nodeTree from Emmet or HTML string in memory
     * @param  {String}       value     Emmet or HTML string
     * @param  {Object|Array} [varMap]  key/value map of variables
     * @function
     */    
    renderAll: "All"

}, (methodName, all) => function(value, varMap) {

    // Create native DOM elements
    // e.g. "document.createElement('div')"
    if (value.nodeType === 1) return nodeTree(value);

    if (!is(value, "string")) minErr(methodName + "()", "Not supported.");

    var doc = this[0].ownerDocument,
        sandbox = this._._sandbox || (this._._sandbox = doc.createElement("div"));

    var nodes, el;

    if ( value && value in tagCache ) {

        nodes = doc.createElement( value );

        if ( all ) nodes = [ new nodeTree( nodes ) ];

    } else {

        value = trim( value );

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
                    nodes.push( new nodeTree( el ) );
                } else {
                    nodes = el;

                    break; // stop early, because need only the first element
                }
            }
        }
    }
    return all ? nodes : nodeTree( nodes );
});