import { implement } from "../helpers"; 
import { RETURN_THIS } from "../const";

// Globalize implement for use with plug-ins
implement({
    extend(mixins, Document) {
        if (Document) {
            // handle case when Document prototype is extended
            return implement(mixins);
        }
        // handle case when Element protytype is extended
        return implement(mixins, null, () => RETURN_THIS);
    }
});