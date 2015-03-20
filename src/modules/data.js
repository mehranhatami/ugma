import { implement, forOwn, is } from "../helpers";
import { RETURN_THIS } from "../const";

implement({
    // Getter/setter of a data entry value
    data: "_",
    // Getter/setter of data-custom attribute
    custom: "data-"
}, (method, prefix) => function(key, value) {
    if (arguments.length === 1) {

        if (key && is(key, "object")) {

        // Assume we've been passed an object full of key/value pairs.
        forOwn(key, (key, value) => {
            this.set(prefix + key, value);
        });


        } else {
            return this.get(prefix + key);
        }
    } else if (arguments.length === 2) {
        this.set(prefix + key, value);
    }
    return this;

}, (methodName, all) => () => RETURN_THIS);