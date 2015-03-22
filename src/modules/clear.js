import { implement, each } from "../helpers";
import { RETURN_THIS } from "../const";

var BOOLEANS = {};

each("multiple selected checked disabled readOnly required open".split(" "), (value) => {
  BOOLEANS[value.toLowerCase()] = value;
});

implement({
    // Clear a property/attribute on the node
    clear(name) {

        var node = this[0];

        if (BOOLEANS[name.toLowerCase()]) {
            // Boolean attributes need to be set to 'false' before removed
            node[name] = false;
            node.removeAttribute(name.toLowerCase());

        } else {
            node.removeAttribute(name);
        }
    }

}, null, () => RETURN_THIS);