/**
 * @module empty
 */

import { implement   } from "../helpers";
import { RETURN_THIS } from "../const";

implement({
    // Remove child nodes of current element from the DOM
    empty() { return this.set( "" ) }
}, null, () => RETURN_THIS);