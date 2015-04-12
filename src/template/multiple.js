/**
 * @module multiple
 */

var dollarRegex = /\$/g,
    indexRegex = /(\$+)(?:@(-)?(\d+)?)?/g,
    multiple = ( num, term ) => {

       // normalize negative values
       if ( num <= 0 ) num = 1;

        var i = num,
            result = [];

        // while loop iteration gives best performance
        while ( i-- ) {
            result[i] = term.replace( indexRegex, ( expr, fmt, sign, base ) => {
                var pos = ( sign ? num - i - 1 : i ) + ( base ? +base : 1 );
                // handle zero-padded index values, like $$$ etc.
                return ( fmt + pos ).slice( -fmt.length ).replace( dollarRegex, "0" );
            });
        }
        return result;
    };
/*
 * Export interface
 */  
export { multiple };