/**
 * @module offsetparent
 */


import { implement, nodeTree  } from "../core/core";
import { RETURN_FALSE, HTML   } from "../const";

implement({
    // This method will return documentElement in the following cases:
    // 1) For the element inside the iframe without offsetParent, this method will return
    //    documentElement of the parent window
    // 2) For the hidden or detached element
    // 3) For body or html element, i.e. in case of the html node - it will return itself
    //
    // but those exceptions were never presented as a real life use-cases
    // and might be considered as more preferable results.
    //
    // This logic, however, is not guaranteed and can change at any point in the future
    offsetParent() {
        var node = this[ 0 ],
            offsetParent = node.offsetParent || HTML,
            isInline = this.css( "display" ) === "inline";

        if ( !isInline && offsetParent ) return nodeTree( offsetParent );

        while ( offsetParent && nodeTree(offsetParent).css( "position" ) === "static" ) {
            offsetParent = offsetParent.offsetParent;
        }

        return nodeTree( offsetParent );
    }
}, null, () => RETURN_FALSE);