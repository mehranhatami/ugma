/**
 * @module get
 */

import { minErr               } from "../minErr";
import { implement            } from "../core/core";
import { isArray, each, is    } from "../helpers";
import { readData             } from "../util/readData";
import   accessorhooks          from "../util/accessorhooks";

implement({
   
  /**
   * Get HTML5 Custom Data Attributes, property or attribute value by name
   * @param  {String|Array}  name  property or attribute name or array of names
   * @return {String|Object} a value of property or attribute
   * @chainable
   * @example
   *
   *   <a id="tag" href="/tags/prototype" rel="tag" title="view related bookmarks." my_widget="some info.">Hatami</a>
   *
   *      ugma.query('#tag').get('href');
   *      // -> '/tags/prototype'
   *
   *      ugma.query('#tag').get('title');
   *      // -> 'view related bookmarks.'
   *
   *      ugma.query('#tag').get('my_widget');
   *      // -> 'some info.'
   *
   * @other examples
   *
   *    link.get('attrName');              // get
   *    link.get("data-a1");               // get data-* attribute
   *    link.get("outerHTML");             // get 'outerHTML'
   *    link.get("textContent");           // get 'textContent'
   */
   
    get(name) {
        var node = this[ 0 ],
            hook = accessorhooks.get[ name ];

        // Grab necessary hook if it is defined
        if ( hook ) return hook(node, name);

        if ( is(name, "string") ) {
            
            // if no DOM object property method is present... 
            if (name in node) return node[ name ];
            
           return /^data-/.test( name ) ? 
               // try to fetch HTML5 `data-*` attribute      
                  readData( node, name ) : 
                //... fallback to the getAttribute method, and let non-existent attributes return null
                  node.getAttribute( name );

        } else if ( isArray( name ) ) {
            var obj = {};
            each( name, ( key ) => {
                obj[ key ] = this.get( key );
            });

            return obj;
        } else {
            minErr("get()", "This operation is not supported" );
        }
    }
}, null, () => () => {});