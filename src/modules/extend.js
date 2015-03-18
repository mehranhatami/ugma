import { implement } from "../helpers"; 
import { RETURN_THIS } from "../const";

// Globalize implement for use with plug-ins
implement({
    extend(mixins, Document) {

        // failsave if something goes wrong
        if (!mixins) return false;
        // Extend Document prototype
        if (Document) {
            return implement(mixins);
        }
        // Extend Element prototype
        return implement(mixins, null, () => RETURN_THIS);
    }
});