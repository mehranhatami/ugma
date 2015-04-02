var reIndex = /(\$+)(?:@(-)?(\d+)?)?/g,
    reDollar = /\$/g,
    indexing = ( num, term ) => {
        var index = num = num >= 1600 ? /* max 1600 HTML elements */ 1600 : ( num <= 0 ? 1 : num ),
            result = new Array( index );

        while (index--) {
            result[ index ] = term.replace( reIndex, ( expr, fmt, sign, base ) => {
                var pos = ( sign ? num - index - 1 : index ) + ( base ? +base : 1 );
                // handle zero-padded index values, like $$$ etc.
                return ( fmt + pos ).slice( -fmt.length ).replace( reDollar, "0" );
            });
        }
        return result;
    };
    
export { indexing };