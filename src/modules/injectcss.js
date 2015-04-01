import { ERROR_MSG                          } from "../const";
import { minErr                             } from "../minErr";
import { implement, injectElement, is, each } from "../helpers";

implement({
    // Append global css styles
    injectCSS(selector, cssText) {
        var styleSheet = this._._styles;

        if (!styleSheet) {
            let doc = this[ 0 ].ownerDocument,
                styleNode = injectElement( doc.createElement("style") );

            styleSheet = styleNode.sheet || styleNode.styleSheet;
            // store object internally
            this._._styles = styleSheet;
        }

        if ( !is(selector, "string") || !is(cssText, "string") ) {
            minErr( "injectCSS()", ERROR_MSG[ 1 ] );
        }

        each(selector.split(","), function(selector) {
            try {
               styleSheet.insertRule(selector + "{" + cssText + "}", styleSheet.cssRules.length);
            } catch(err) {}
        });
    }
});
