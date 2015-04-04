/**
 * @module get
 */

import { minErr                        } from "../minErr";
import { implement, isArray, each, is  } from "../helpers";
import { readData                      } from "../util/readData";
import   accessorhooks                   from "../util/accessorhooks";

implement({
   
  /**
   * Get HTML5 Custom Data Attributes, property or attribute value by name
   * @param  {String|Array}  name  property or attribute name or array of names
   * @return {String|Object} a value of property or attribute
   * @chainable
   * @example
   *   link.get('attrName'); // get
   */
    get(name) {
        var node = this[ 0 ],
            hook = accessorhooks.get[ name ];

        // Grab necessary hook if it is defined
        if ( hook ) return hook(node, name);

        if ( is(name, "string") ) {
            
            // try to fetch HTML5 `data-*` attribute
            if (/^data-/.test( name ) ) {
                return readData(node, name);
            // if no DOM object property method is present... 
            } else if (name in node) {
                return node[ name ];
            //... fallback to the getAttribute method
            } else {
                return node.getAttribute( name );
            }
          // Non-existent / attributes properties return null
          return null;
        } else if (isArray(name)) {
            var obj = {};
            each( name, (key) => {
                obj[ key ] = this.get( key );
            });

            return obj;
        } else {
            minErr("get()", "This operation is not supported" );
        }
    }
}, null, () => () => {});