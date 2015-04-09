/**
 * @module styleHooks
 */

import { ugma, implement                                         } from "../core/core";
import { minErr                                                  } from "../minErr";
import { filter, map, keys, camelize, each, forOwn, is, isArray  } from "../helpers";
import { VENDOR_PREFIXES, HTML                                   } from "../const";

var unitless = ("box-flex box-flex-group column-count flex flex-grow flex-shrink order orphans " +
    "color richness volume counter-increment float reflect stop-opacity float scale backface-visibility " +
    "fill-opacity font-weight line-height opacity orphans widows z-index zoom column-rule-color perspective alpha " +
    "overflow rotate3d border-right-color border-top-color " +
    // SVG-related properties
    "stop-opacity stroke-mitrelimit stroke-dash-offset, stroke-width, stroke-opacity fill-opacity").split(" "),

    // Add in style property hooks for overriding the default
	// behavior of getting and setting a style property    
    
    styleHooks = { get: {}, set: {} },
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
each(unitless, ( propName ) => {
    var stylePropName = camelize(propName);

    styleHooks.get[ propName ] = stylePropName;
    styleHooks.set[ propName ] = ( value, style ) => {
        style[stylePropName] = value + "";
    };
});

// normalize property shortcuts
forOwn(shortHand, ( key, props ) => {

    styleHooks.get[ key ] = ( style ) => {
        var result = [],
            hasEmptyStyleValue = ( prop, index ) => {
                result.push( prop === "/" ? prop : style[ prop ] );

                return !result[ index ];
            };

        return props.some( hasEmptyStyleValue ) ? "" : result.join( " " );
    };

    styleHooks.set[ key ] = (value, style) => {
        if ( value && "cssText" in style ) {
            // normalize setting complex property across browsers
            style.cssText += ";" + key + ":" + value;
        } else {
            each( props, ( name ) => style[ name ] = typeof value === "number" ? value + "px" : value + "" );
        }
    };
});

styleHooks._default = function(name, style) {
    var propName = camelize( name );

    if ( !( propName in style ) ) {
        propName = filter( map( VENDOR_PREFIXES, ( prefix ) => prefix + propName[ 0 ].toUpperCase() + propName.slice( 1 ) ), ( prop ) => prop in style )[ 0 ];
    }

    return this.get[ name ] = this.set[ name ] = propName;
};

/**
 * Make 'styleHooks' global
 * Has to use the "implement" API method here, so this will be accessible
 * inside the 'shadow DOM' implementation.
 */
 
 implement({
     
  styleHooks:( mixin, where ) => {
     // Stop here if 'where' is not a typeof string
      if( !is( where, "string" ) ) minErr( "ugma.styleHooks()", "Not a valid string value" );
    
      if ( is( mixin, "object" ) && !isArray( mixin ) ) {

          forOwn( mixin, ( key, value ) => {
              if( is( value, "string" ) || is( value, "function" ) ) styleHooks[ where ][ key ] = mixin;
          });
      }
  }

 });

/*
 * Export interface
 */

export default styleHooks;