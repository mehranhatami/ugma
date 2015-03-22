import { implement, is } from "../helpers";
import { minErr } from "../minErr";
import { RETURN_FALSE } from "../const";

implement({
    // Check if the element has specific property/attribute
    // or undefined.
    has(name) {
        if (!is(name, "string")) {
            minErr("has()", "Not a valid property/attribute");
        }

        var node = this[0];

        return !!node[name] || node.hasAttribute(name);
    }
}, null, () => RETURN_FALSE);