/**
 * @module classes
 */

import { DOCUMENT, HTML, RETURN_FALSE, RETURN_THIS } from "../const";
import { implement, trim, is                       } from "../helpers";
import { minErr                                    } from "../minErr";

/* es6-transpiler has-iterators:false, has-generators: false */
var reClass = /[\n\t\r]/g,
    whitespace = /\s/g,
    hasClassList = !!DOCUMENT.createElement("div").classList;

implement({
   
   /**
    * Adds a class(es) or an array of class names
    * @param  {...String} classNames class name(s)
    * @function
    */    
    addClass: [RETURN_THIS, "add", ( node, token ) => {
        var existingClasses = (" " + node[ 0 ].className + " ")
            .replace(reClass, " ");

        if (existingClasses.indexOf(" " + token + " ") === -1) {
            existingClasses += trim(token) + " ";
        }

        node[ 0 ].className = trim(existingClasses);
    }],
   /**
    * Remove class(es) or an array of class names from element
    * @param  {...String} classNames class name(s)
    * @function
    */    
    removeClass: [RETURN_THIS, "remove", ( node, token ) => {
        node[ 0 ].className = trim((" " + node[ 0 ].className + " ")
            .replace(reClass, " ")
            .replace(" " + trim(token) + " ", " "));
    }],
   /**
    * Check if element contains class name
    * @param  {...String} classNames class name(s)
    * @function
    */    
    hasClass: [RETURN_FALSE, "contains", false, ( node, token ) => {
        return ((" " + node[ 0 ].className + " ")
            .replace(reClass, " ").indexOf(" " + token + " ") > -1);
    }],
   /**
    * Toggle the `class` in the class list. Optionally force state via `condition`
    * @param  {...String} classNames class name(s)
    * @function
    */    
    toggleClass: [RETURN_FALSE, "toggle", ( el, token ) => {
        var hasClass = el.hasClass(token);

        if (hasClass) {
            el.removeClass(token);
        } else {
            el[ 0 ].className += " " + token;
        }

        return !hasClass;
    }]
}, (methodName, defaultStrategy, nativeMethodName, strategy) => {

    /* istanbul ignore else  */
    if (hasClassList) {
        // use native classList property if possible
        strategy = function(el, token) {
            return el[0].classList[nativeMethodName](token);
        };
    }

    if (defaultStrategy === RETURN_FALSE) {

        return function(token, force) {
           
            if (typeof force === "boolean" && nativeMethodName === "toggle") {
                this[force ? "addClass" : "removeClass"](token);

                return force;
            }

            if (!is(token, "string")) minErr(nativeMethodName + "()", "The class provided is not a string.");

            return strategy(this, trim(token));
        };
    } else {

        return function() {
                var i = 0,
                    len = arguments.length;
                for (; i < len; i++) {    
                
                if (!is(arguments[ i ], "string")) minErr(nativeMethodName + "()", "The class provided is not a string.");

                strategy(this, arguments[ i ]);
            }

            return this;
        };
    }
}, (methodName, defaultStrategy) => defaultStrategy);