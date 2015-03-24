import { implement } from "../helpers"; 
import { RETURN_THIS } from "../const";
// Globalize implement for use with plug-ins
implement({
    extend(mixins, global) {
        // failsave if something goes wrong
        if (mixins) {
            // Extend Document prototype
            if (global) {
                return implement(mixins);
            }
            // Extend Element prototype
            return implement(mixins, null, () => RETURN_THIS);
        }
        return false;
    }
});