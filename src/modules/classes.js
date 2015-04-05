/**
 * @module classes
 */

import { HTML, RETURN_FALSE, RETURN_THIS } from "../const";
import { implement, trim, is             } from "../helpers";
import { minErr                          } from "../minErr";

/* es6-transpiler has-iterators:false, has-generators: false */

let reClass = /[\n\t\r]/g;

implement({
   
   /**
    * Adds a class(es) or an array of class names
    * @param  {...String} classNames class name(s)
    * @chainable
    * @example
    * link.addClass('bar');
    * link.addClass('bar', 'foo');
    */   
    addClass: [ "add", true, ( node, token ) => {
        var existingClasses = ( " " + node[ 0 ].className + " " ).replace( reClass, " " );

        if ( existingClasses.indexOf( " " + token + " " ) === -1 ) {
            existingClasses += token + " ";
        }

        node[ 0 ].className = trim(existingClasses);
    }],
   /**
    * Remove class(es) or an array of class names from element
    * @param  {...String} classNames class name(s)
    * @chainable
    * @example
    * link.removeClass('bar');
    * link.removeClass('bar' , 'foo');
    */
    removeClass: [ "remove", true, ( node, token ) => {
        node[ 0 ].className = (" " + node[ 0 ].className + " ")
            .replace(reClass, " ")
            .replace(" " + token + " ", " ");
    }],
   /**
    * Check if element contains class name
    * @param  {...String} classNames class name(s)
    * @chainable
    * @example
    * link.hasClass('bar');
    */
    hasClass: [ "contains", false, ( node, token ) => {
        return ( (" " + node[ 0 ].className + " " )
            .replace( reClass, " " ).indexOf( " " + token + " " ) > -1 );
    }],
   /**
    * Toggle the `class` in the class list. Optionally force state via `condition`
    * @param  {...String} classNames class name(s)
    * @chainable
    * @example
    * link.toggleClass('bar');
    * link.toggleClass('bar', 'foo');
    */    
    toggleClass: ["toggle", false, ( el, token ) => {
        var hasClass = el.hasClass( token );
       
         if(hasClass) {
             el.removeClass( token ); 
         } else {
            el.addClass( token ); 
         }

        return !hasClass;
    }]
}, ( methodName, nativeMethodName, iteration, strategy ) => {

    if ( HTML.classList ) {
        // use native classList property if possible
        strategy = function( el, token ) {
            return el[ 0 ].classList[ nativeMethodName ]( token );
        };
    }

    if ( !iteration ) {

        return function( token, force ) {
           
            if ( is( force, "boolean") && nativeMethodName === "toggle" ) {
                this[ force ? "addClass" : "removeClass" ]( token );

                return force;
            }

            if ( !is( token, "string" ) ) minErr( nativeMethodName + "()", "The class provided is not a string." );

            return strategy( this, token );
        };
    } else {

        return function() {
                
                for (var i = 0, len = arguments.length; i < len; i++) {    
                
                if ( !is(arguments[ i ], "string" ) ) minErr( nativeMethodName + "()", "The class provided is not a string." );

                strategy( this, arguments[ i ] );
            }
            return this;
        };
    }
 }, ( methodName, defaultStrategy ) => {
      if( defaultStrategy === "contains" ||defaultStrategy === "toggle" ) return RETURN_FALSE;
      return RETURN_THIS;
  });