import { implement, is } from "../helpers";
import { RETURN_FALSE, ERROR_MSG } from "../const";
import { minErr } from "../minErr";
import SelectorMatcher from "../util/selectormatcher";
import pseudoselectors from "../util/pseudoselectors";

 // Reference: https://dom.spec.whatwg.org/#dom-element-matches

implement({
    // Check if the element matches a selector against an element
    matches(selector) {

        if (selector && is(selector, "string")) {
            // compare a match with CSS pseudos selectors 
            // e.g "link.matches(":enabled") or "link.matches(":checked")
            var checker = pseudoselectors[selector] ||  SelectorMatcher(selector);
            return !!checker(this[0]);
        }
       // Throw
        minErr("matches()", ERROR_MSG[1]);
    }
}, null, () => RETURN_FALSE);