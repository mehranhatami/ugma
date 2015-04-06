/**
 * @module multiple
 */

var dollarRegex = /\$/g,
    indexRegex = /(\$+)(?:@(-)?(\d+)?)?/g,
    multiple = ( num, term ) => {

        /**
         * Set limit to 'max' 1600 HTML  created at once
         * else ' new Array' will throw, and the whole 
         * process will become slow if more then 1800.
         */

        if ( num >= 1600 ) num = 1600;
        
        // normalize to avoid negative values
        if ( num <= 0 ) num = 1;

        var i = num,
            result = new Array( i );

        // while loop iteration gives best performance
        while ( i-- ) {
            result[ i ] = term.replace( indexRegex, ( expr, fmt, sign, base ) => {
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