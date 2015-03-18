import { implement } from "../helpers";
import { minErr } from "../minErr";
import { Element } from "../core";
import { RETURN_FALSE } from "../const";

// Referance: https://dom.spec.whatwg.org/#dom-node-comparedocumentposition 
implement({
    // Test whether an element contains another element in the DOM.
    contains(other) {
        // Let reference be the context object.
        var reference = this[0];

        if (other instanceof Element || (other && other.nodeType === 1)) {
            other = (other.nodeType === 1) ? other : other[0];
            // If other and reference are the same object, return zero.
            if (other === reference) return 0;

            /* istanbul ignore else */
            if (reference.contains) {
                return reference.contains(other) !== null;
            }
            // Return true if reference is an ancestor of other.
            return !!(reference.compareDocumentPosition(other) & 16); // 10 in hexadecimal
        }
        minErr("contains()", "Comparing position against non-Node values is not allowed.");
    }
}, null, () => RETURN_FALSE);