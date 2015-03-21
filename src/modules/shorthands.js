import { implement } from "../helpers";
import { RETURN_THIS } from "../const";

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
        return this.set(value, null);
    }

}, null, () => RETURN_THIS);
