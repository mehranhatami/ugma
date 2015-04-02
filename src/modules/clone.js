import { ugma                 } from "../const";
import { nodeTree, dummyTree  } from "../core/core";
import { minErr               } from "../minErr";
import { implement, is        } from "../helpers";

// Reference: https://dom.spec.whatwg.org/#dom-node-clonenode

implement({
    // Returns a copy of node. If deep is true, the copy 
    // also includes the node's descendants.
    clone(deep) {
        
        if (!is(deep, "boolean")) minErr("clone()", "The object can not be cloned.");
        
        return new nodeTree( this[ 0 ].cloneNode(deep) );
    }
}, null, () => () => new dummyTree());