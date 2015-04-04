/**
 * @module accessorHooks
 */

import { trim, each, forOwn, every          } from "../helpers";
import { DOCUMENT, WINDOW, FOCUSABLE, BOOLS } from "../const";

var langFix = /_/g,
    radioValue, 
    optSelected, 
    checkOn,
    accessorHooks = {

        get: {

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
                if ( node.type === "checkbox" && !checkOn ) {
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
                    if ( every.call(node.options, ( o ) => !( o.selected = o.value === value ) ) ) {
                        node.selectedIndex = -1;
                    }
                } else {
                    // for IE use innerText for textareabecause it doesn't trigger onpropertychange
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
     checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	 optSelected = opt.selected;

    // Support: IE<=11+
    // An input loses its value after becoming a radio
    input = DOCUMENT.createElement( "input" );
    input.value = "t";
    input.type = "radio";
    radioValue = input.value === "t";
})();

// Support: IE<=11+
if ( !radioValue ) {
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

if ( !optSelected ) {
    accessorHooks.get.selected = ( node ) => {
        var parent = node.parentNode;
        /* jshint ignore:start */
        if ( parent && parent.parentNode ) {
            parent.parentNode.selectedIndex;
        }
        /* jshint ignore:end */
        return null;
    };
}

// Attributes that are booleans
each(("compact nowrap ismap declare noshade disabled readOnly multiple hidden scoped multiple async " +
      "selected noresize defer defaultChecked autofocus controls autoplay autofocus loop").split(" "), function( key ) {
    // For Boolean attributes we need to give them a special treatment, and set 
    // the corresponding property to either true or false
    accessorHooks.set[ key.toLowerCase() ] = ( node, value ) => {
       // completely remove the boolean attributes when set to false, otherwise set it to true
        node[ key ] = !!value ? true : false;
        // set / remove boolean attributes
        node[ !!value ? "setAttribute" : "removeAttribute" ]( value );
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
    "longDesc").split(" "), function( key ) {
    accessorHooks.get[ key.toLowerCase() ] = ( node ) => node[ key ];
});

    var MSApp = WINDOW.MSApp;
    // Use a 'hook' for innerHTML because of Win8 apps
    accessorHooks.set.innerHTML = (node, value) => {
        // Win8 apps: Allow all html to be inserted
        if (typeof MSApp !== "undefined" && MSApp.execUnsafeLocalFunction) {
            MSApp.execUnsafeLocalFunction(function() {
                node.innerHTML = value;
            });
        }
        node.innerHTML = value;
    };

/*
 * Export interface
 */

export default accessorHooks;