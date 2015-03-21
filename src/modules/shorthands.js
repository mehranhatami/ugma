import { implement } from "../helpers";
import { RETURN_THIS, BOOLEANS } from "../const";

implement({
     // Remove all children of the current node
    empty() {
        return this.set("");
    },
    // Returns `true` if the attribute / property contains a value that is not null
    // or undefined.
    has(value) {
        return this.get(value) != null;
    },
    // Clear all attributes / properties on the node
    clear(value) {
        // Boolean attributes need to be set to 'false' before removed
        return this.set(value, BOOLEANS[value.toLowerCase()] ? false : null);
    }

}, null, () => RETURN_THIS);
