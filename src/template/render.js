import { ERROR_MSG                         } from "../const";
import { minErr                            } from "../minErr";
import { ugma, nodeTree                    } from "../core/core";
import   tagCache                            from "../template/template";
import { implement, reduce, is, trim       } from "../helpers";

implement({
    // Create a new nodeTree from Emmet or HTML string in memory
    render: "",
    // Create a new array of nodeTree from Emmet or HTML string in memory
    renderAll: "All"

}, (methodName, all) => function(value, varMap) {

    if (is(value, "string")) {

        var doc = this[ 0 ].ownerDocument,
            sandbox = this._._sandbox || (this._._sandbox = doc.createElement( "div" ));

        var nodes, el;

        if (value && value in tagCache) {

            nodes = doc.createElement( value );

            if (all) nodes = [ new nodeTree( nodes ) ];
        } else {
            value = trim( value );
            // handle vanila HTML strings
            // e.g. <div id="foo" class="bar"></div>
            if (value[ 0 ] === "<" && value[ value.length - 1 ] === ">" && value.length >= 3) {

                value = varMap ? ugma.format(value, varMap) : value;

            } else { // emmet strings
                value = ugma.template( value, varMap );
            }

            sandbox.innerHTML = value; // parse input HTML string

            nodes = all ? [] : null;

            if (sandbox.childNodes.length === 1 && sandbox.firstChild.nodeType === 1) {
                nodes = sandbox.removeChild( sandbox.firstChild );
            } else {

                for (; el = sandbox.firstChild;) {
                    sandbox.removeChild( el ); // detach element from the sandbox

                    if (el.nodeType === 1) {
                        nodes.push( new nodeTree( el ) );
                    }
                }
            }
        }
        return all ? nodes : nodeTree( nodes );
    }

    if (value.nodeType !== 1) {
        minErr(methodName + "()", "Not supported");
    }

    return nodeTree(value);
});