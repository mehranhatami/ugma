import { implement } from "../helpers";
import { minErr } from "../minErr";
import { Element } from "../core";
import { RETURN_FALSE } from "../const";

implement({
    // The contains(other) method returns true if other is an inclusive descendant of the 
    // context object, and false otherwise (including when other is null).
    //
    // Reference: https://dom.spec.whatwg.org/#dom-node-comparedocumentposition 
    contains(other) {
        // let reference be the context object.
        var reference = this[0],
            nodeType = other.nodeType;

        if (other instanceof Element ||
           (other && nodeType === 1)) {

            other = (nodeType === 1) ? other : other[0];

            // If other and reference are the same object, return zero.
            if (other === reference) return 0;

            return reference.contains ?
                reference.contains(other) !== null :
                !!(reference.compareDocumentPosition(other) & 16);
        }
        minErr("contains()", "Comparing position against non-Node values is not allowed.");
    }
}, null, () => RETURN_FALSE);