/**
 * @module styleAccessor
 */

import { ugma                                                    } from "../core/core";
import { minErr                                                  } from "../minErr";
import { filter, map, keys, camelize, each, forOwn, is, isArray  } from "../helpers";
import { VENDOR_PREFIXES, HTML                                   } from "../const";

var UnitlessNumber = ("box-flex box-flex-group column-count flex flex-grow flex-shrink order orphans " +
    "color richness volume counter-increment float reflect stop-opacity float scale backface-visibility " +
    "fill-opacity font-weight line-height opacity orphans widows z-index zoom column-rule-color perspective alpha " +
    "overflow rotate3d border-right-color border-top-color text-decoration-color text-emphasis-color " +
    // SVG-related properties
    "stop-opacity stroke-mitrelimit stroke-dash-offset, stroke-width, stroke-opacity fill-opacity").split(" "),
    
    styleAccessor = { get: {}, set: {} },
    directions = ["Top", "Right", "Bottom", "Left"],
    shortHand = {
        font:           ["fontStyle", "fontSize", "/", "lineHeight", "fontFamily"],
        borderRadius:   ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
        padding:        map( directions, ( dir ) => "padding" + dir ),
        margin:         map( directions, ( dir ) => "margin" + dir ),
        "border-width": map( directions, ( dir ) => "border" + dir + "Width" ),
        "border-style": map( directions, ( dir ) => "border" + dir + "Style" )
    };

// Don't automatically add 'px' to these possibly-unitless properties
each(UnitlessNumber, ( propName ) => {
    var stylePropName = camelize(propName);

    styleAccessor.get[ propName ] = stylePropName;
    styleAccessor.set[ propName ] = ( value, style ) => {
        style[stylePropName] = value + "";
    };
});

// normalize property shortcuts
forOwn(shortHand, (key, props) => {

    styleAccessor.get[ key ] = (style) => {
        var result = [],
            hasEmptyStyleValue = (prop, index) => {
                result.push(prop === "/" ? prop : style[ prop ]);

                return !result[index];
            };

        return props.some(hasEmptyStyleValue) ? "" : result.join(" ");
    };

    styleAccessor.set[ key ] = (value, style) => {
        if (value && "cssText" in style) {
            // normalize setting complex property across browsers
            style.cssText += ";" + key + ":" + value;
        } else {
            each( props, (name) => style[ name ] = typeof value === "number" ? value + "px" : value + "" );
        }
    };
});

styleAccessor._default = function(name, style) {
    var propName = camelize( name );

    if (!(propName in style)) {
        propName = filter( map(VENDOR_PREFIXES, ( prefix ) => prefix + propName[ 0 ].toUpperCase() + propName.slice( 1 )), ( prop ) => prop in style)[ 0 ];
    }

    return this.get[ name ] = this.set[ name ] = propName;
};

/**
 * Hook 'styleAccessor' on ugma namespace
 */

  ugma.styleAccessor = function( mixin, where ) {
     // Stop here if 'where' is not a typeof string
      if( !is( where, "string" ) ) minErr("ugma.styleAccessor()", "Not a valid string value");
    
      if ( is( mixin, "object" ) && !isArray( mixin ) ) {

          forOwn( mixin, ( key, value ) => {
              if( is( value, "string" ) || is( value, "function" ) )
              styleAccessor[ where ][ key ] = mixin;
          });
      }
  };
  
/*
 * Export interface
 */

export default styleAccessor;