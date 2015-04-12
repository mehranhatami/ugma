/**
 * @module contains
 */

import { implement, instanceOf  } from "../core/core";
import { minErr                 } from "../minErr";
import { RETURN_FALSE           } from "../const";

implement({
 /**
  * Check if element is inside of context
  * @param  {HTMLElement, ugmaElement} element The containing ugma wrapped object or html element.
  * @return {Boolean} Whether or not the element is or contains the 'other'
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
    contains( other ) {

        var reference = this[ 0 ],
            nodeType = other && other.nodeType;

        if ( !other || ( instanceOf( other ) || nodeType === 1 ) ) {

             other = nodeType === 1 ? other : other[ 0 ];

            // If other and reference are the same object, return zero.
            if ( reference === other ) return 0;
            // Match contains behavior (node.contains(node) === true).
            return reference.contains( other );
        }

        minErr( "contains()", "Comparing position against non-Node values is not allowed." );
    }
}, null, () => RETURN_FALSE );