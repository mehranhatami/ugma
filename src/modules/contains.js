/**
 * @module contains
 */

import { implement       } from "../helpers";
import { minErr          } from "../minErr";
import { nodeTree        } from "../core/core";
import { RETURN_FALSE    } from "../const";

implement({
 /**
  * Check if element is inside of context
  * @param  {ugma wrapped Object} element to check
  * @return {Boolean} returns true if success and false otherwise
  *
  * @example
  *   ugma.contains(childElement);
  *     // true/false
  *
  * Note! 
  *
  * The contains(other) method returns true if other is an inclusive descendant of the 
  * context object, and false otherwise (including when other is null).
  *
  * @reference: https://dom.spec.whatwg.org/#dom-node-contains 
  */
    contains( element ) {
        var reference = this[ 0 ];

        if ( element instanceof nodeTree ) {
            var otherNode = element[ 0 ];

            // If other and reference are the same object, return zero.
            if ( reference === otherNode ) return 0;

            return reference.contains(otherNode);
        }

        minErr( "contains()", "Comparing position against non-Node values is not allowed." );
    }
}, null, () => RETURN_FALSE);