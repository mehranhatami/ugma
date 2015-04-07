/**
 * @module css
 */

import { RCSSNUM                                             } from "../const";
import { implement                                           } from "../core/core";
import { isArray, computeStyle, is, map, forOwn, each, trim  } from "../helpers";
import { minErr                                              } from "../minErr";
import   styleAccessor                                         from "../util/styleAccessor";
import { adjustCSS                                           } from "../util/adjustCSS";

 implement({
   /**
     * Get the value of a style property for the DOM Node, or set one or more style properties for a DOM Node.
     * @param  {String|Object}      name    style property name or key/value object
     * @param  {String|Function}    [value] style property value or functor
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
     
     css(name, value) {
         
         var len = arguments.length,
             node = this[ 0 ],
             style = node.style,
             computed;

         // Get CSS values with support for pseudo-elements
         if ( len === 1 && ( is( name, "string" ) || isArray( name ) ) ) {
             
             var getValue = ( name ) => {
                 var getter = styleAccessor.get[ name ] || styleAccessor._default( name, style ),

                     value = is( getter, "function" ) ? getter( style ) : style[ getter ];

                 if ( !value ) {

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
          
             var ret, setter = styleAccessor.set[ name ] || styleAccessor._default( name, style );

             if ( is( value, "function" ) ) value = value( this );

             if ( value == null || is( value, "boolean" ) ) value = "";

             // Convert '+=' or '-=' to relative numbers
             if ( value !== "" && ( ret = RCSSNUM.exec( value ) ) && ret[ 1 ] ) {

                 value = adjustCSS( this, setter, ret, computed || computeStyle(node));

                 if ( ret && ret[ 3 ] ) value += ret[ 3 ];
             }

             if ( is( setter, "function" ) ) {
                 setter ( value, style );
             } else {
                 style[ setter ] = is( value, "number" ) ? value + "px" : "" + value; // cast to string 
             }
         } else if ( len === 1 && name && is( name, "object" ) ) {
             
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