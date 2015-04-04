/**
 * @module value
 */

import { implement, isArray  } from "../helpers";

implement({
    /**
     * Read or write inner content of the element
     * @param  {Mixed}  [content]  optional value to set
     * @chainable
     * @example
     *     link.content('New value');
     *
     *     var div = ugma.render("div>a+b");
     *     div.value(ugma.render("i"));
     */
     content( val ) {
        if ( arguments.length === 0 ) {
            return this.get();
        }

        if ( val._ || isArray( val ) ) {
            return this.set( "" ).append( val );
        }

       return this.set( val );
    }
}, null, () => function() {
    if ( arguments.length ) return this;
});