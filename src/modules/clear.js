import { implement   } from "../helpers";
import { RETURN_THIS } from "../const";

implement({
    // Clear a property/attribute on the node
    clear(name) {
        this[ 0 ].removeAttribute( name );
        return this;
    }

}, null, () => RETURN_THIS);