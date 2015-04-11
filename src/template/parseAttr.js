/**
 * @module parseAttr
 */

import { is } from "../helpers";

function parseAttr( quote, name, value, rawValue ) {
    // try to determine which kind of quotes to use
    quote = value && value.indexOf( "\"" ) >= 0 ? "'" : "\"";

    if ( is( rawValue, "string" ) ) value = rawValue;
    // handle boolean attributes by using name as value
    if ( !is( value, "string" ) ) value = name;
   
    // always wrap attribute values with quotes even they don't exist
    return " " + name + "=" + quote + value + quote;
}

/*
 * Export interface
 */
export { parseAttr };