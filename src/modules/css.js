/**
 * @module css
 */

import { implement                                     } from "../core/core";
import { isArray, computeStyle, is, map, forOwn, each  } from "../helpers";
import { minErr                                        } from "../minErr";
import   styleHooks                                      from "../util/styleHooks";

 implement({
   /**
     * Sets and get a style property for a given element.
     * @param  {String|Object}      name   style property name or key/value object
     * @param  {String|Function}    value  style property value or functor
     * @param {Object} [style] The style node. Defaults to `node.style`.
     * @chainable
     * @example
     *
     * // #Getter
     *
     *    link.css('fontSize');
     *    // -> '12px'
     *
     *  // #Setter
     *
     *     link.css({
     *        cssFloat: 'left',
     *        opacity: 0.5
     *      });
     *      // -> Element
     *      
     *      link.css({
     *        'float': 'left', // notice how float is surrounded by single quotes
     *        opacity: 0.5
     *      });
     *      // -> Element
     *  
     */
     
     css( name, value, style ) {
         var len = arguments.length,
             node = this[ 0 ],
             computed;

           style = style || node.style;             
           
         // Get CSS values with support for pseudo-elements
         if ( len === 1 && ( is( name, "string" ) || isArray( name ) ) ) {
             
             var getValue = ( name ) => {
                 var getter = styleHooks.get[ name ] || styleHooks._default( name, style ),
                     // Try inline styles first
                     value = is( getter, "function" ) ? getter( style ) : style[ getter ];

                 if ( !value || value === "auto" ) {
                     // Reluctantly retrieve the computed style.
                     if ( !computed ) computed = computeStyle(node, "" );

                     value = is( getter, "function" ) ? getter( computed ) : computed[ getter ];
                 }

                 return value;
             };

             if ( is( name, "string" ) ) return getValue( name );

                 var obj = {};
                  each( map( name, getValue ), ( value, index ) => {
                     obj[ name [ index ] ] = value;
                 } );
               return obj;
         }

         if ( len === 2 && is( name, "string" ) ) {
          
             var setter = styleHooks.set[ name ] || styleHooks._default( name, style );

             if ( is( value, "function" ) ) value = value( this );

             if ( value == null) value = "";

             if ( is( setter, "function" ) ) {
                 setter ( value, style );
             } else {
                 style[ setter ] = /* number values may need a unit */ is( value, "number" ) ? value + "px" : value;
             }
         } else if ( len === 1 && name && is( name, "object" ) ) {
             // Sets multiple style properties.
             forOwn( name, ( key, value ) => {
                 this.css( key, value );
             });
             
         } else {
             minErr( "css()", "This operation is not supported" );
         }

         return this;
     }
 }, null, () => function( name ) {
     
     var len = arguments.length;
     
     if ( len === 1 && isArray( name ) ) return {};

     if ( len !== 1 || !is( name, "string" ) ) return this;
 });