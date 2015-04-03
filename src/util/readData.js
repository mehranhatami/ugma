/**
 * @module readData
 */

var multiDash = /([A-Z])/g,
    // Read the specified attribute from the equivalent HTML5 `data-*` attribute,
    readData = ( node, key ) => {

    // convert from camel case to dash-separated value

    key = key.replace( multiDash, "-$&" ).toLowerCase();

    var value = node.getAttribute( key );

    if ( value != null ) {

        // try to recognize and parse object notation syntax
        if ( value[ 0 ] === "{" && value[ value.length - 1 ] === "}" ) {
            try {
                value = JSON.parse( value );
            } catch ( err ) {}
        }
    }

    return value;
};

export { readData };