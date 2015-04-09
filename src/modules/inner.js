/**
 * @module inner
 */
import { implement, instanceOf  } from "../core/core";
import { isArray                } from "../helpers";

implement({
    /**
     * Read or write inner content of the element
     * @param  {Mixed}  [content]  optional value to set
     * @chainable
     * @example
     *
     *     link.content('New value');
     *
     *     var div = ugma.render("div>a+b");
     *     div.inner(ugma.render("i"));
     */
     inner( value ) {
  
       if ( arguments.length === 0 ) return this.get();

       if ( instanceOf( value ) || isArray( value ) ) return this.set( "" ).append( value );

       return this.set( value );
    }
}, null, () => function() {
    
    if ( arguments.length ) return this;
    
});



    
