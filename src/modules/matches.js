/**
 * @module matches
 */

import { implement       } from "../core/core";
import { is              } from "../helpers";
import { RETURN_FALSE    } from "../const";
import { minErr          } from "../minErr";
import   SelectorMatcher   from "../util/selectormatcher";
import   pseudoClasses     from "../util/pseudoClasses";

 // Reference: https://dom.spec.whatwg.org/#dom-element-matches
implement({
   /**
     * Returns `true` if the element would be selected by the specified selector string; otherwise, returns `false`.
     * @param  {String} selector Selector to match against element
     * @return {Boolean} returns true if success and false otherwise
     *
     * @example
     *    link.matches('.match');
     */
    matches( selector ) {
        if ( !selector || !is( selector, "string" ) ) minErr( "matches()", "The string did not match the expected pattern" );
            // compare a match with CSS pseudos selectors 
            // e.g "link.matches(":enabled") or "link.matches(":checked")
            var checker = pseudoClasses[ selector ] ||  SelectorMatcher( selector );
            return !!checker( this[ 0 ] );
    }
}, null, () => RETURN_FALSE );