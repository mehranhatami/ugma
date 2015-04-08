/**
 * @module closest
 */

import { Nodes, Shallow, implement       } from "../core/core";
import   SelectorMatcher                   from "../util/selectormatcher";
import { is                              } from "../helpers";
import { minErr                          } from "../minErr";

// Reference: https://dom.spec.whatwg.org/#dom-element-closest 

implement({
 /**
  * Return the closest element matching the selector
  * @param {String} [selector] css selector
  * @Following the Element#closest specs  
  * @chainable
  * @example
  *
  *        <body>
  *          <div id="father">
  *            <div id="kid">
  *            </div>
  *          </div>
  *        </body>
  *      </html>
  *
  *   ugma.query('#kid').closest()
  *
  *      // -> [div#father]
  */
    closest( selector ) {
        if ( selector && !is( selector, "string" ) ) minErr( "closest()", "The string did not match the expected pattern" );

        var matches = SelectorMatcher( selector ),
            parentNode = this[ 0 ];
        
        // document has no .matches
        if ( !matches ) parentNode = parentNode.parentElement;

        for (; parentNode; parentNode = parentNode.parentElement )
           if (parentNode.nodeType === 1 && ( !matches || matches( parentNode ) ) ) break;

        return Nodes( parentNode );
    }
}, null, () => () => new Shallow() );