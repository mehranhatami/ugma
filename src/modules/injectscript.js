/**
 * @module injectscript
 */

import { implement, injectElement, is, sliceArgs } from "../helpers";
import { minErr                                  } from "../minErr";

implement({
  /**
   * Import external scripts on the page and call optional callback when it will be done
   * @param {...String} urls       script file urls
   * @param {Function}  [callback] callback that is triggered when all scripts are loaded
   */
    injectScript() {
        var urls = sliceArgs( arguments ),
            doc = this[ 0 ].ownerDocument,
            callback = () => {

                var arg = urls.shift(),
                    script;

                if (is(arg, "string")) {

                    script = doc.createElement( "script" );
                    script.onload = callback;

                    // Support: IE9
                    // Bug in IE force us to set the 'src' after the element has been
                    // added to the document.
                    injectElement( script );

                    script.src = arg;
                    script.async = true;
                    script.type = "text/javascript";

                } else if ( is(arg, "function") ) {
                    arg();
                } else if ( arg ) {
                    minErr("injectScript()", "Wrong amount of arguments." );
                }
            };

        callback();
    }
});