/**
 * @module clone
 */

import { Nodes, Shallow, implement } from "../core/core";
import { minErr                         } from "../minErr";
import { is                             } from "../helpers";

// Reference: https://dom.spec.whatwg.org/#dom-node-clonenode

implement({
  /**
   * Returns a copy of a DOM node.
   * @param {Boolean} [deep=true] true if all descendants should also be cloned, or false otherwise
   * @chainable
   * @example
   *
   *      <div class="original">
   *        <div class="original_child"></div>
   *      </div>
   *  
   *      var clone = ugma.query('.original').clone(false);
   *      clone[0].className;
   *      // -> "original"
   *      clone[0].children;
   *      // -> HTMLCollection[]
   *  
   *      var deepClone = ugma.query('original').clone(true);
   *      deepClone[0].className;
   *      // -> "original"
   *
   *      deepClone[0].children;
   *      // -> HTMLCollection[div.original_child]
   */
    clone( deep ) {
        
        if ( !is( deep, "boolean" ) ) minErr( "clone()", "This element can not be cloned." );
        
        return new Nodes( this[ 0 ].cloneNode( deep) );
    }
}, null, () => () => new Shallow() );