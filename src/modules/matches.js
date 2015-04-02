import { implement, is      } from "../helpers";
import { RETURN_FALSE       } from "../const";
import { minErr             } from "../minErr";
import   SelectorMatcher      from "../util/selectormatcher";
import   pseudoClasses        from "../util/pseudoClasses";

 // Reference: https://dom.spec.whatwg.org/#dom-element-matches
implement({
    // Check if the element matches a selector against an element
    matches( selector ) {
        if ( !selector || !is(selector, "string") ) minErr("matches()", "The string did not match the expected pattern" );
            // compare a match with CSS pseudos selectors 
            // e.g "link.matches(":enabled") or "link.matches(":checked")
            var checker = pseudoClasses[ selector ] ||  SelectorMatcher( selector );
            return !!checker( this[ 0 ] );
    }
}, null, () => RETURN_FALSE );