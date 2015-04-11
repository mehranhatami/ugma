/**
 * @module injectcss
 */
 
 /**
  * http://www.w3.org/TR/DOM-Level-2-Style/css.html
  */
import { implement            } from "../core/core";
import { DOCUMENT             } from "../const";
import { minErr               } from "../minErr";
import { is, each, map, keys  } from "../helpers";
import   styleHooks             from "../util/styleHooks";

implement({

    /**
     * Construct and append global CSS styles
     *
     * @param {String}         selector  css selector
     * @param {String}  styleContent   Content style for given element.
     * @example
     *
     *    ugma.injectCSS(".foo", "width:200px;height:20px;border:2px solid;");
     *    ugma.importStyles(".foo", {color: "red", padding: 5}); // key/value pairs
     *    ugma.importStyles(".bar", "background: white; color: gray"); // strings
     */
     
    injectCSS( selector, styleContent ) {

        if ( styleContent && is( styleContent, "object" ) ) {
            
            var objCSS = ( styleContent ) => {
                // use styleObj to collect all style props for a new CSS rule
                var styleObj = keys( styleContent ).reduce( ( styleObj, prop ) => {
                    var hook = styleHooks.set[ prop ];
                        
                    if ( hook && is( hook, "function" ) ) {
                        hook( styleObj, styleContent[ prop ] );
                    } else {
                        styleObj[ prop ] = styleContent[ prop ];
                    }

                    return styleObj;
                }, {} );

               return keys(styleObj).map((key) => key + ":" + styleObj[key]).join(";");
            };

            styleContent = objCSS(styleContent);
        }

        var styleSheet = this._._styles;

        if ( !styleSheet ) {

            var doc = this[0].ownerDocument,
                styleElement = doc.createElement( "style" ),
                styleNode = styleElement.ownerDocument.head.appendChild( styleElement );

            styleSheet = styleNode.sheet || styleNode.styleSheet;
            // store object internally
            this._._styles = styleSheet;
        }

        if ( !is( selector, "string" ) || !is( styleContent, "string" ) ) minErr( "injectCSS()", "The string did not match the expected pattern" );

        each( selector.split(","), function( selector ) {
            try {
                if ( styleSheet.cssRules ) {
                     styleSheet.insertRule( selector + "{" + styleContent + "}", styleSheet.cssRules.length );
                } else if ( selector[0] !== "@" ) {
                     styleSheet.addRule( selector, styleContent );
                }
            } catch ( err ) {}
        });
    }
});