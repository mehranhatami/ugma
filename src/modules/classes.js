/**
 * @module classes
 */

import { HTML, RETURN_FALSE, RETURN_THIS } from "../const";
import { implement                       } from "../core/core";
import { is                              } from "../helpers";
import { minErr                          } from "../minErr";

/* es6-transpiler has-iterators:false, has-generators: false */

let reClass = /[\n\t\r]/g;

implement({
   
   /**
    * Adds a class(es) or an array of class names
    * @param  {...String} classNames class name(s)
    * @chainable
    * @example
    * 
    *      <div id="foo" class="apple fruit"></div>
    *
    *      ugma.query('#foo')[0].className;
    *      // -> 'apple fruit'
    *
    *      ugma.query('#foo').addClass('food');
    *
    *      ugma.query('#foo')[0].className;
    *      // -> 'apple fruit food'
    */
    addClass: [ "add", true, ( node, token ) => {
        var existingClasses = ( " " + node[ 0 ].className + " " ).replace( reClass, " " );

        if ( existingClasses.indexOf( " " + token + " " ) === -1 ) existingClasses += token + " ";

        node[ 0 ].className = existingClasses.trim();
    }],
   /**
    * Remove class(es) or an array of class names from element
    * @param  {...String} classNames class name(s)
    * @chainable
    * @example
    * 
    *      <div id="foo" class="apple fruit food"></div>
    *  
    *      ugma.query('#foo').removeClass('food');
    *      // -> Element
    *      
    *      ugma.query('#foo')[0].className;
    *      // -> 'apple fruit'
    */
    removeClass: [ "remove", true, ( node, token ) => {
        node[ 0 ].className = (" " + node[ 0 ].className + " ").replace(reClass, " ").replace(" " + token + " ", " ");
    }],
   /**
    * Check if element contains class name
    * @param  {...String} classNames class name(s)
    * @chainable
    * @example
    *  
    *      <div id="foo" class="apple fruit food"></div>
    *
    *
    *      ugma.query('#foo').hasClass('fruit');
    *      // -> true
    *      
    *      ugma.query('#foo').hasClass('vegetable');
    *      // -> false    
    */
    hasClass: [ "contains", false, ( node, token ) => {
        if ( (" " + node[ 0 ].className + " " ).replace( reClass, " " ).indexOf( " " + token + " " ) > -1 ) return true;
        
        return false;
    }],
   /**
    * Toggle the `class` in the class list. Optionally force state via `condition`
    * @param  {...String} classNames class name(s)
    * @chainable
    * @example
    * 
    *      <div id="foo" class="apple"></div>
    *
    *      ugma.query('#foo').hasClass('fruit');
    *      // -> false
    *      
    *      ugma.query('#foo').toggleClass('fruit');
    *      // -> true
    *      
    *      ugma.query('#foo').hasClass('fruit');
    *      // -> true
    *  
    *      ugma.query('#foo').toggleClass('fruit', true);
    *      // -> true
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
}, ( methodName, classList, iteration, fallback ) => {

    // use native classList property if possible
    if ( HTML.classList ) fallback = ( el, token ) => el[ 0 ].classList[ classList ]( token );

    if ( !iteration ) {

        return function( token, stateVal ) {
           
            if ( is( stateVal, "boolean") && classList === "toggle" ) {
                this[ stateVal ? "addClass" : "removeClass" ]( token );

                return stateVal;
            }

            if ( !is( token, "string" ) ) minErr( classList + "()", "The class provided is not a string." );

            return fallback( this, token );
        };
    } else {

        return function() {
            
          var index = -1,
              length = arguments.length;

           while ( ++index < length ) {
  
                if ( !is( arguments[ index ], "string" ) ) minErr( classList + "()", "The class provided is not a string." );

                fallback( this, arguments[ index ] ); 
           }

           return this;
        };
    }
 }, ( methodName ) => {

      if( methodName === "hasClass" || methodName === "toggleClass" ) return RETURN_FALSE;
      
      return RETURN_THIS;
  });