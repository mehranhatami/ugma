/**
 * @module pseudoClasses
 */

import { computeStyle, forOwn } from "../helpers";
import { FOCUSABLE            } from "../const";

var pseudoClasses = {

        ":input": ( node ) => FOCUSABLE.test(node.nodeName),

        ":selected": ( node ) => {
            // Accessing this property makes selected-by-default
            // options in Safari work properly
            /* jshint ignore:start */
            if ( node.parentNode ) {
                node.parentNode.selectedIndex;
            }
            /* jshint ignore:end */
            return node.selected === true;
        },
        ":enabled": ( node ) =>  !node.disabled,
        ":disabled": ( node ) => node.disabled,
        // In CSS3, :checked should return both checked and selected elements
        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked

        ":checked": ( node ) => !!("checked" in node ? node.checked : node.selected),

        ":focus": ( node ) => node === node.ownerDocument.activeElement,

        ":visible": ( node ) => !pseudoClasses[ ":hidden" ](node),

        ":hidden": ( node ) => (node.style.visibility === "hidden" || node.style.display === "none")
    };

function createButtonPseudo( type ) {
    return ( node ) => {
        var name = node.nodeName;
        return (name === "INPUT" || name === "BUTTON") && node.type === type;
    };
}

function createInputPseudo( type ) {
    return ( node ) => {
        var name = node.nodeName;
        return name === "INPUT" && node.type === type;
    };
}

// Add button/input type pseudos
forOwn({ radio: true, checkbox: true, file: true, text: true, password: true, image: true }, ( key, value ) => {
    pseudoClasses[ ":" + key ] = createInputPseudo( key );
});

forOwn({ submit: true, reset: true }, ( key, value ) => {
    pseudoClasses[ ":" + key ] = createButtonPseudo( key );
});

export default pseudoClasses;