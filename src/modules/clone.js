/**
 * @module clone
 */

import { nodeTree, dummyTree, implement } from "../core/core";
import { minErr                         } from "../minErr";
import { is                             } from "../helpers";

// Reference: https://dom.spec.whatwg.org/#dom-node-clonenode

implement({
  /**
   * Returns a copy of a DOM node.
   * @param {Boolean} [deep=true] true if all descendants should also be cloned, or false otherwise
   */
    clone( deep ) {
        
        if ( !is( deep, "boolean" ) ) minErr( "clone()", "This element can not be cloned." );
        
        return new nodeTree( this[ 0 ].cloneNode( deep) );
    }
}, null, () => () => new dummyTree() );