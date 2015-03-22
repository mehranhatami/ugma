import { implement, is } from "../helpers";
import { RETURN_FALSE, ERROR_MSG } from "../const";
import { minErr } from "../minErr";
import SelectorMatcher from "../util/selectormatcher";
import pseudoselectors from "../util/pseudoselectors";

implement({
    // Check if the element matches selector
    is(selector) {

        if (selector && is(selector, "string")) {
            // compare a match with CSS pseudos selectors 
            // e.g "link.matches(":enabled") or "link.matches(":checked")
            var checker = pseudoselectors[selector] ||
                // native
                SelectorMatcher(selector);
            return !!checker(this[0]);
        }

        // For objects, fallback to contains()
        if (is(selector, "object")) {
            return this.contains(selector);
        }
        // Throw
        minErr("matches()", ERROR_MSG[1]);
    }
}, null, () => RETURN_FALSE);