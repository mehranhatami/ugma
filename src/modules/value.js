import { implement, isArray  } from "../helpers";
import { Element             } from "../core";

implement({
    // Read or write inner content of the element
    value(val) {
        if (arguments.length === 0) {
            return this.get();
        }

        if (val._ || isArray( val ) ) {
            return this.set( "" ).append(val);
        }

       return this.set( val );
    }
}, null, () => function() {
    if (arguments.length) return this;
});