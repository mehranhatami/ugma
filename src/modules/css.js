/**
 * @module css
 */

import { RCSSNUM                                                        } from "../const";
import { implement, isArray, computeStyle, is, map, forOwn, each, trim  } from "../helpers";
import { minErr                                                         } from "../minErr";
import   styleAccessor                                                    from "../util/styleAccessor";
import { adjustCSS                                                      } from "../util/adjustCSS";

 implement({
   /**
     * Get the value of a style property for the DOM Node, or set one or more style properties for a DOM Node.
     * @param  {String|Object}      name    style property name or key/value object
     * @param  {String|Function}    [value] style property value or functor
     * @chainable
     * @example
     * link.css('padding-left'); // get
     * link.css('color', '#f00'); // set
     * link.css({'border-width', '1px'}, {'display', 'inline-block}); // set multiple
     */
     css(name, value) {
         
         var len = arguments.length,
             node = this[ 0 ],
             pseudoElement = value && value[ 0 ] === ":",
             style = node.style,
             computed;

         // Get CSS values
         // with support for pseudo-elements in getComputedStyle 
         if ( pseudoElement || ( len === 1 && ( is( name, "string" ) || isArray( name ) ) ) ) {
             let getValue = ( name ) => {
                 var getter = styleAccessor.get[ name ] || styleAccessor._default( name, style ),

                     // if a 'pseudoElement' is present, don't change the original value. 
                     // The 'pseudoElement' need to be the second argument.
                     // E.g. link.css('color', ':before');
                     value = pseudoElement ? value : is( getter, "function" ) ? getter( style ) : style[ getter ];

                 if ( !value || pseudoElement ) {
                     if ( !computed ) computed = computeStyle(node, pseudoElement ? value : "" );

                     value = is( getter, "function" ) ? getter( computed ) : computed[ getter ];
                 }

                 return value;
             };

             if ( is( name, "string" ) ) {

                 return getValue(name);

             } else {
                 var obj = {};
                  each( map( name, getValue ), ( value, index ) => {
                     obj[ name [ index ] ] = value;
                 } );
               return obj;
             }
         }

         if ( len === 2 && is( name, "string" ) ) {
             var ret, setter = styleAccessor.set[ name ] || styleAccessor._default( name, style );

             if ( is( value, "function" ) ) value = value( this );

             if ( value == null || is( value, "boolean" ) ) value = "";

             // Convert '+=' or '-=' to relative numbers
             if ( value !== "" && ( ret = RCSSNUM.exec( value ) ) && ret[ 1 ] ) {

                 if (!computed) computed = computeStyle(node);

                 value = adjustCSS( this, setter, ret, computed );

                 if ( ret && ret[ 3 ] ) value += ret[ 3 ];
             }

             if ( is( setter, "function" ) ) {
                 setter ( value, style );
             } else {
                 // prevent dangerous style values
                 style[ setter ] = is( value, "number" ) ? value + "px" : ( is( value, "string" )  ? trim( value ) : "" + value ); // cast to string 
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

     if ( arguments.length === 1 && isArray( name ) ) return {};

     if ( arguments.length !== 1 || !is( name, "string" ) ) return this;
 });