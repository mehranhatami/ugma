/**
 * @module readData
 */

import { is } from "../helpers";

var multiDash = /([A-Z])/g,
    rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,

 /**
  * "true"  => true
  * "false" => false
  * "null"  => null
  * "42"    => 42
  * "42.5"  => 42.5
  * "08"    => "08"
  * JSON    => parse if valid
  * String  => self
  */
  deserializeValue = (value) => {
    try {
      return value ?
        value === "true" ||
        ( value === "false" ? false :
          value === "null" ? null :
          +value + "" === value ? +value :
          rbrace.test(value) ? JSON.parse(value) :
          value )
        : value;
    } catch ( err ) {}
  },

    // Read the specified attribute from the equivalent HTML5 `data-*` attribute,
    readData = ( node, value ) => {

    // convert from camel case to dash-separated value
    value = value.replace( multiDash, "-$&" ).toLowerCase();

    value = node.getAttribute( value );

    return is( value, "string") ? deserializeValue(value) : null;
};

/*
 * Export interface
 */

export { readData, deserializeValue };