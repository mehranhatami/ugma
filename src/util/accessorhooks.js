/**
 * @module accessorHooks
 */

import { ugma                                    } from "../core/core";
import { trim, each, forOwn, every, is, isArray  } from "../helpers";
import { DOCUMENT, WINDOW, FOCUSABLE             } from "../const";
import { minErr                                  } from "../minErr";
import   support                                   from "../util/support";

var langFix = /_/g,
    accessorHooks = {
        // boolean attributes
        booleans: {},
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
                return trim( node[ node.hasAttribute( "value" ) ? "value" : "text" ] );
            },
            select: ( node ) => ~node.selectedIndex ? node.options[ node.selectedIndex ].value : "",

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
            lang: ( node, value ) => {
                // correct locale browser language before setting the attribute             
                // e.g. from zh_CN to zh-cn, from en_US to en-us
                node.setAttribute( "lang", value.replace( langFix, "-" ).toLowerCase() );
            },

            style: ( node, value ) => {
                node.style.cssText = value;
            },
            title: ( node, value ) => {
                var doc = node.ownerDocument;

                ( node === doc.documentElement ? doc : node ).title = value;
            },
            value: ( node, value ) => {

                if ( node.tagName === "SELECT" ) {
                    // selectbox has special case
                    if ( every.call(node.options, ( o ) => !( o.selected = o.value === value ) ) ) node.selectedIndex = -1;

                } else {
                    node.value = value;
                }
            }
        }
    };
    
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
    input = DOCUMENT.createElement( "input" );
    input.value = "t";
    input.type = "radio";
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
        var parent = node.parentNode;
        /* jshint ignore:start */
        if ( parent && parent.parentNode ) parent.parentNode.selectedIndex;
        /* jshint ignore:end */
        return null;
    };
}

// Attributes that are booleans
each(("compact nowrap ismap declare noshade disabled readOnly multiple hidden scoped multiple async " +
      "selected noresize defer defaultChecked autofocus controls autoplay autofocus loop").split(" "), function( name ) {
    // For Boolean attributes we need to give them a special treatment, and set 
    // the corresponding property to either true or false
    accessorHooks.set[ name.toLowerCase() ] = ( node, value ) => {
        
        if ( value === false ) {
			// completely remove the boolean attributes when set to false, otherwise set it to true
			node[ name ] = false;
            node.removeAttribute( name );
		} else {
			node[ name ] = true;
			node.setAttribute( value, value );
		}
    // populate 'accessorHooks.booleans'
    accessorHooks.booleans[ name.toLowerCase() ] = name;
    };
});

// properties written as camelCase
each((
   // 6.4.3 The tabindex attribute
    "tabIndex "         +
    "readOnly "         +
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
    "accessKey "        +
    "encType "          +
    "readOnly  "        +
    "vAlign  "          +
    "longDesc" ).split( " " ), function( key ) {
    accessorHooks.get[ key.toLowerCase() ] = ( node ) => node[ key ];
});

/**
 * Hook 'accessorHooks' on the ugma namespace
 */

  ugma.accessorHooks = ( mixin, where ) => {
     // Stop here if 'where' is not a typeof string
      if( !is( where, "string" ) ) minErr( "ugma.accessorHooks()", "Not a valid string value" );
    
      if ( is( mixin, "object" ) && !isArray( mixin ) ) {

          forOwn( mixin, ( key, value ) => {
              if( is( value, "string" ) || is( value, "function" ) ) accessorHooks[ where ][ key ] = mixin;
          });
      }
  };
  
/*
 * Export interface
 */

export default accessorHooks;