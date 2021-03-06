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

// SVG attributes
// NOTE!! At some pont SVG DOM conflicts with DOM, so for this edge cases there has to 
// be developed separate hooks to check "isSVG(node")
each( ( "width height x y cx cy r rx ry x1 x2 y1 y2 transform viewbox preserveaspectratio autoReverse " +
"calcMode clip clipPathUnits direction diffuseConstant xml:base preserveAspectRatio limitingConeAngle " +
"contentScriptType contentStyleType cursor g1 g2 glyphRef gradientTransform gradientUnits d decelerate descent   " +
"display divisor dur dx dy k1 k2 k3 k4 lengthAdjust pathLength patternContentUnits patternTransform patternUnits " +
"tableValues target targetX targetY xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type " +
"xml:lang xml:space viewTarget unicode radius refX refY markerUnits markerWidth mask maskContentUnits maskUnits mathematical " +
"max media method min mode format from fx fy g1 g2 gradientTransform gradientUnits hanging onabort onactivate " +
"orient orientation origin overflow path local points pointsAtX pointsAtY pointsAtZ preserveAlpha " +
"primitiveUnits to textLength").split(" "), ( key ) => {
    
    // getter
    accessorHooks.get[ key.toLowerCase() ] = ( node ) => {

        // we use use getBBox() to ensure we always get values for elements with undefined height/width attributes.
        if ( key === "width" || key === "height" ) {

            // Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM.
            try {
                return node.getBBox()[ key ];
            } catch ( err ) {
                return 0;
            }
        }
         // Otherwise, access the attribute value directly.
         // Note: For SVG attributes, vendor-prefixed property names are never used.
         return node.getAttribute( key );
    };
    
    // setter
    accessorHooks.set[ key ] = ( node, value ) => { /* nothinf for now. Will be implemented!! */
     
      // FIX ME!
      // SVG Transform need to be developed
      // if( key === "transform" ) { }
      
    // SVG nodes have their dimensional properties (width, height, x, y, cx, etc.) applied directly 
    // as attributes instead of as styles.
      node.setAttribute( key, value );
    };
});

/**
 * Special SVG attribute treatment
 */
 
forOwn({
    alignmentBaseline:          "alignment-baseline",
    baselineShift:              "baseline-shift",
    clipPath:                   "clip-path",
    clipRule:                   "clip-rule",
    colorInterpolation:         "color-interpolation",
    colorInterpolationFilters:  "color-interpolation-filters",
    colorRendering:             "color-rendering",
    dominantBaseline:           "dominant-baseline",
    enableBackground:           "enable-background",
    fillOpacity:                "fill-opacity",
    fillRule:                   "fill-rule",
    floodColor:                 "flood-color",
    floodOpacity:               "flood-opacity",
    fontFamily:                 "font-family",
    fontSize:                   "font-size",
    fontSizeAdjust:             "font-size-adjust",
    fontStretch:                "font-stretch",
    fontStyle:                  "font-style",
    fontVariant:                "font-variant",
    fontWeight:                 "font-weight",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical:   "glyph-orientation-vertical",
    horizAdvX:                  "horiz-adv-x",
    horizOriginX:               "horiz-origin-x",
    imageRendering:             "image-rendering",
    letterSpacing:              "letter-spacing",
    lightingColor:              "lighting-color",
    markerEnd:                  "marker-end",
    markerMid:                  "marker-mid",
    markerStart:                "marker-start",
    stopColor:                  "stop-color",
    stopOpacity:                "stop-opacity",
    strikethroughPosition:      "strikethrough-position",
    strikethroughThickness:     "strikethrough-thickness",
    strokeDashArray:            "stroke-dasharray",
    strokeDashOffset:           "stroke-dashoffset",
    strokeLineCap:              "stroke-linecap",
    strokeLineJoin:             "stroke-linejoin",
    strokeMiterLimit:           "stroke-miterlimit",
    strokeOpacity:              "stroke-opacity",
    strokeWidth:                "stroke-width",
    textAnchor:                 "text-anchor",
    textDecoration:             "text-decoration",
    textRendering:              "text-rendering",
    underlinePosition:          "underline-position",
    underlineThickness:         "underline-thickness",
    vertAdvY:                   "vert-adv-y",
    vertOriginY:                "vert-origin-y",
    wordSpacing:                "word-spacing",
    writingMode:                "writing-mode"
}, ( key, original )  => {

    accessorHooks.set[ key ] = ( node, value ) => {
        node.setAttribute( original, value );
    };
    accessorHooks.get[ key ] = ( node ) => {
       return node.getAttribute( original );
    };
});

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
       accessorHooks:accessorHooks
 });
  
    
/*
 * Export interface
 */

export default accessorHooks;