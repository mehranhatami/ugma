/**
 * @module render
 */

import { minErr                  } from "../minErr";
import { ugma, Nodes, implement  } from "../core/core";
import   tagCache                  from "../template/template";
import { is                      } from "../helpers";

implement({

    /**
     * Creates a new DOM node from Emmet or HTML string in memory using the provided markup string.
     * @param  {String}       template     The Emmet or HTML markup used to create the element
     * @param  {Object|Array} [varMap]  key/value map of variables
     */
    render: "",

    /**
     * Create a new array of Nodes from Emmet or HTML string in memory
     * @param  {String}       template    The Emmet or HTML markup used to create the element
     * @param  {Object|Array} [varMap]  key/value map of variables
     * @function
     */    
    renderAll: "All"

}, (methodName, all) => function(template, varMap) {

    // Create native DOM elements
    // e.g. "document.createElement('div')"
    if (template.nodeType === 1) return Nodes(template);

    if (!is(template, "string")) minErr(methodName + "()", "Not supported.");

    var doc = this[0].ownerDocument,
        sandbox = this._.sandbox || (this._.sandbox = doc.createElement("div"));

    var nodes, el;

    if ( template && template in tagCache ) {

        nodes = doc.createElement( template );

        if ( all ) nodes = [ new Nodes( nodes ) ];

    } else {

        template = template.trim();

        // handle vanila HTML strings
        // e.g. <div id="foo" class="bar"></div>
        if (template[ 0 ] === "<" && template[ template.length - 1 ] === ">" && template.length >= 3 ) {

            template = varMap ? ugma.format( template, varMap ) : template;

        } else { // emmet strings
            template = ugma.template( template, varMap );
        }

        sandbox.innerHTML = template; // parse input HTML string

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