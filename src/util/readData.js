/**
 * @module readData
 */

var multiDash = /([A-Z])/g,
    // Read the specified attribute from the equivalent HTML5 `data-*` attribute,
    readData = ( node, value ) => {

    // convert from camel case to dash-separated value
    value = value.replace( multiDash, "-$&" ).toLowerCase();

    value = node.getAttribute( value );

    if ( value != null ) {

        // object notation syntax should have JSON.stringify form
        if ( value[ 0 ] === "{" && value[ value.length - 1 ] === "}" ) {
            try {
                value = JSON.parse( value );
            } catch ( err ) {}
        }
    }

    return value;
};

/*
 * Export interface
 */

export { readData };