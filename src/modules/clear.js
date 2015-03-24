import { implement, each } from "../helpers";
import { RETURN_THIS, BOOLS } from "../const";

var BOOLEANS = {};

each(BOOLS, (value) => BOOLEANS[value.toLowerCase()] = value);

implement({
    // Clear a property/attribute on the node
    clear(name) {

        let node = this[0],
            lower = name.toLowerCase();
            
        if (BOOLEANS[lower]) {
            // Boolean attributes need to be set to 'false' before removed
            node[name] = false;
            node.removeAttribute(lower);

        } else {
            node.removeAttribute(name);
        }
    }

}, null, () => RETURN_THIS);