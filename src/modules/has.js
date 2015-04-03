/**
 * @module has
 */

import { implement, is   } from "../helpers";
import { minErr          } from "../minErr";
import { RETURN_FALSE    } from "../const";

implement({
    // Returns true if the requested attribute is specified on the
    // given element, and false otherwise.
    has(name) {
        if (is(name, "string")) return !!this[ 0 ][ name ] || this[ 0 ].hasAttribute( name );

        minErr("has()", "Not a valid property/attribute");
    }
}, null, () => RETURN_FALSE);