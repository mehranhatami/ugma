/**
 * @module accessorHooks
 */

import { implement                         } from "../core/core";
import { each, forOwn, every, is, isArray  } from "../helpers";
import { DOCUMENT, FOCUSABLE               } from "../const";
import { minErr                            } from "../minErr";
import   support                             from "../util/support";

var langFix = /_/g,
    accessorHooks = {
        // getter
        get: {
            // special case - setting a style
            style: ( node ) => node.style.cssText,
            title: ( node ) => {
                var doc = node.ownerDocument;

                return ( node === doc.documentElement ? doc : node ).title;
            },
            tabIndex: ( node ) => node.hasAttribute( "tabindex" ) || FOCUSABLE.test( node.nodeName ) || node.href ? node.tabIndex : -1,
            option: ( node ) => {
                // Support: IE<11
                // option.value not trimmed
                return node[ node.hasAttribute( "value" ) ? "value" : "text" ].trim();
            },
            select: ( node ) => {
                // multipe select
                if ( node.multiple ) {
                    var result = [];
                    // Loop through all the selected options
                    each( node.options, ( option ) => {
                        // IE9 doesn't update selected after form reset
                        if ( option.selected &&
                            // Don't return options that are disabled or in a disabled optgroup
                            option.getAttribute( "disabled" ) === null &&
                            ( !option.parentNode.disabled || option.parentNode.nodeName !== "OPTGROUP" ) ) {

                            result.push( option.value || option.text );
                        }
                    });
                    return result.length ? result : null;
                }
                return ~node.selectedIndex ? node.options[ node.selectedIndex ].value : "";
            },
            value: ( node ) => {
                // Support: Android<4.4
                // Default value for a checkbox should be "on"
                if ( node.type === "checkbox" && !support.checkOn ) {
                    return node.getAttribute( "value" ) === null ? "on" : node.value;
                }
                return node.value;
            },

            undefined: ( node ) => {
                switch ( node.tagName ) {
                    case "SELECT":
                        return accessorHooks.get.select( node );
                    case "OPTION":
                        return accessorHooks.get.option( node );
                    default:
                        return node[ node.type && "value" in node ? "value" : "innerHTML" ];
                }
            },
            type: ( node ) => node.getAttribute( "type" ) || node.type
        },
        // setter
        set: {
            // correct locale browser language before setting the attribute             
            // e.g. from zh_CN to zh-cn, from en_US to en-us
            lang:  ( node, value ) => { node.setAttribute( "lang", value.replace( langFix, "-" ).toLowerCase() ) },
            style: ( node, value ) => { node.style.cssText = "" + value },
            title: ( node, value ) => {
                var doc = node.ownerDocument;

                ( node === doc.documentElement ? doc : node ).title = value;
            },
            value: ( node, value ) => {

                if ( node.tagName === "SELECT" ) {
                    // We need to handle select boxes special
                    if ( every.call(node.options, ( o ) => !( o.selected = o.value === value ) ) ) node.selectedIndex = -1;

                } else {
                    node.value = value;
                }
            }
        }
    };

// immediately-invoked function expression (IIFE)    
(function() {
	var input = DOCUMENT.createElement( "input" ),
		select = DOCUMENT.createElement( "select" ),
		opt = select.appendChild( DOCUMENT.createElement( "option" ) );

    input.type = "checkbox";

    // Support: Android<4.4
    // Default value for a checkbox should be "on"
     support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	 support.optSelected = opt.selected;

    // Support: IE<=11+
    // An input loses its value after becoming a radio
    input.type = "radio";
    input.value = "t";
    support.radioValue = input.value === "t";
})();

// Support: IE<=11+
if ( !support.radioValue ) {
    accessorHooks.set.type = ( node, value ) => {

        if ( value === "radio" ) {
            var val = node.value;

            node.setAttribute( "type", val );
            
            if ( value ) node.value = val;

        } else {
            node.type = value;
        }
    };
}

if ( !support.optSelected ) {
    accessorHooks.get.selected = ( node ) => {
        /* jshint ignore:start */
        var parent = node.parentNode;
        if ( parent && parent.parentNode ) parent.parentNode.selectedIndex;
        /* jshint ignore:end */
        return null;
    };
}

/**
 * Properties written as camelCase
 *
 * https://html.spec.whatwg.org/multipage/forms.html
 */
 
each((
   // 6.4.3 The tabindex attribute
    "readOnly "         +   // Whether to allow the value to be edited by the user
    "tabIndex "         +
    "maxLength "        +
    "cellSpacing "      +
    "cellPadding "      +
    "rowSpan "          +
    "colSpan "          +
    "useMap "           +
    "dateTime  "        +
    "innerHTML "        +
    "frameBorder "      +
    // 6.6.1 Making document regions editable: The contenteditable content attribute
    "contentEditable "  +
    "textContent "      +
    "valueType "        +
    "defaultValue "     +
    "noValidate "       +
    "acceptCharset "    +
    "accessKey "        +
    "encType "          +
    "vAlign  "          +
    "formAction "       +  // URL to use for form submission
    "formMethod "       +  // HTTP method to use for form submission
    "formNoValidate "   +  // Bypass form control validation for form submission 
    "formTarget "       +  // Browsing context for form submission
    "inputMode "        +  // Hint for selecting an input modality
    "maxLength "        +  // Maximum length of value
    "minLength "        +  // Minimum length of value
    "defaultValue "     +
    "valueAsDate "      +
    "valueLow "         +
    "valueHeight "      +
    "willValidate "     +
    "checkValidity "    +  // Returns true if the form's controls are all valid; otherwise, returns false.
    "reportValidity "   +  // Returns true if the form's controls are all valid; otherwise, returns false and informs the user.
    "selectionStart "   +
    "selectionEnd "     +
    "longDesc" ).split( " " ), ( key )  => {
    accessorHooks.get[ key.toLowerCase() ] = ( node ) => node[ key ];
});

/**
 * Make 'accessorHooks' global
 * Has to use the "implement" API method here, so this will be accessible
 * inside the 'shadow DOM' implementation.
 */
 
 implement({
     
  accessorHooks:(  mixin, where ) => {
     // Stop here if 'where' is not a typeof string
      if( !is( where, "string" ) ) minErr( "ugma.accessorHooks()", "Not a valid string value" );
    
      if ( is( mixin, "object" ) && !isArray( mixin ) ) {

          forOwn( mixin, ( key, value ) => {
              if( is( value, "string" ) || is( value, "function" ) ) accessorHooks[ where ][ key ] = mixin;
          });
      }
  }
  
 });
  
    
/*
 * Export interface
 */

export default accessorHooks;