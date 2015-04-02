import { is, inArray } from "../helpers";

function parseAttr( quote, name, value, rawValue ) {
    // try to determine which kind of quotes to use
    quote = value && inArray( value, "\"" ) >= 0 ? "'" : "\"";

    if ( is( rawValue, "string" ) ) {
        value = rawValue;
    } 
    
    if ( !is( value, "string" ) ) {
        value = name;
    }
    return " " + name + "=" + quote + value + quote;
}
export { parseAttr };