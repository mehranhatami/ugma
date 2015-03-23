import { ugma } from "../const";
import { Element, Node } from "../core";
import { minErr } from "../minErr";
import { implement, is } from "../helpers";

implement({
    // Returns a copy of node. If deep is true, the copy 
    // also includes the node's descendants.
    //
    // https://dom.spec.whatwg.org/#dom-node-clonenode
    clone(deep) {
        if (!is(deep, "boolean")) minErr("clone()", "The object can not be cloned.");

        return new Element(this[0].cloneNode(deep));
    }
}, null, () => () => new Node());