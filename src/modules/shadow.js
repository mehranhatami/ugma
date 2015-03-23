import { implement } from "../helpers";
import { WINDOW, INTERNET_EXPLORER, RETURN_FALSE } from "../const";
import { Document, ugma } from "../core";

    // shadow() method are developed after ideas located here: onhttp://www.w3.org/TR/shadow-dom/   
    // Shadow is not the same as Shadow DOM, but follow the same syntax. Except a few differences.
    //
    // - unlike shadow DOM you can have several shadows for a single DOM element.
    // - each shadow *must* have it's unique name
    // - each shadow can be removed with the remove() method. E.g. el.shadow("foo").remove();       
    // - the shadow root - as mentioned in the specs - is a instance of a new document, and has it
    //   own methods such as query[All] Returned value of the method is Element that represents 
    //   the shadow in the main document tree. Allmost the same as the specs.
    //
    // Equalities to the specs:
    // ------------------------
    //
    // - internal DOM events do not bubble into the document tree
    // - subtree is not accessible via query[All] (neither native querySelector[All]) 
    //   because it's in another document.
    //
    // Note! There are more cons then pros in this, and it's important to know that the shadow() method
    // is not SEO friendly
    //        
var MUTATION_WRAPPER = "div[style=overflow:hidden]>object[data=`about:blank` type=text/html style=`position:absolute` width=100% height=100%]";
/* istanbul ignore if */
if (INTERNET_EXPLORER) {
    // use calc to cut ugly frame border in IE>8
    MUTATION_WRAPPER = MUTATION_WRAPPER.replace("position:absolute", "width:calc(100% + 4px);height:calc(100% + 4px);left:-2px;top:-2px;position:absolute");

        // for IE>8 have to set the data attribute AFTER adding element to the DOM
        MUTATION_WRAPPER = MUTATION_WRAPPER.replace("data=`about:blank` ", "");
}
// Chrome/Safari/Opera have serious bug with tabbing to the <object> tree:
// https://code.google.com/p/chromium/issues/detail?id=255150

implement({
    shadow(name, callback = () => {}) {
        var contexts = this._._shadow || (this._._shadow = {}),
            data = contexts[name] || [];

        if (data[0]) {
            // callback is always async
            WINDOW.setTimeout(() => { callback(data[1]) }, 1);

            return data[0];
        }
        // use innerHTML instead of creating element manually because of IE8
        var ctx = ugma.add(MUTATION_WRAPPER),
            object = ctx.get("firstChild");
        // set onload handler before adding element to the DOM
        object.onload = () => {
            // apply user-defined styles for the context
            // need to add class in ready callback because of IE8
            if (ctx.addClass(name).css("position") === "static") {
                ctx.css("position", "relative");
            }
            // store new context root internally and invoke callback
            callback(data[1] = new Document(object.contentDocument));
        };

        this.before(ctx);
        /* istanbul ignore if */
        if (INTERNET_EXPLORER) {
            // IE doesn't work if to set the data attribute before adding
            // the <object> element to the DOM. IE8 will ignore this change
            // and won't start builing a new document for about:blank
            object.data = "about:blank";
        }
        // store context data internally
        contexts[name] = data;

        return data[0] = ctx;
    }
}, null, () => () => RETURN_FALSE);
