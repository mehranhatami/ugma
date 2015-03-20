import { implement, is, every } from "../helpers";
import { RETURN_THIS } from "../const";
import { Element } from "../core";

implement({
    // Replace child nodes of current element
    value(val) {
        if (arguments.length === 0) {
            return this.get();
        }
        if (is(val, "string")) {
            return this.set(val);
        }
        return this.set("").append(val);
    }
}, null, () => RETURN_THIS);