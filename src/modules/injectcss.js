/**
 * @module injectcss
 */
 
 /**
  * http://www.w3.org/TR/DOM-Level-2-Style/css.html
  */
import { implement               } from "../core/core";
import { minErr                  } from "../minErr";
import { injectElement, is, each } from "../helpers";

implement({
  /**
   * Append global css styles
   * @param {String}         selector  css selector
   * @param {String}  cssText   css rules
   */
    injectCSS(selector, cssText) {
        var styleSheet = this._._styles;

        if ( !styleSheet ) {
            let doc = this[ 0 ].ownerDocument,
                styleNode = injectElement( doc.createElement( "style" ) );

            styleSheet = styleNode.sheet || styleNode.styleSheet;
            // store object internally
            this._._styles = styleSheet;
        }

        if ( !is( selector, "string" ) || !is( cssText, "string" ) ) minErr( "injectCSS()", "The string did not match the expected pattern" );

        each( selector.split( "," ), function( selector ) {
            try {
               styleSheet.insertRule(selector + "{" + cssText + "}", styleSheet.cssRules.length );
            } catch( err ) {}
        });
    }
});
