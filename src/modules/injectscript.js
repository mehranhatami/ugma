import { implement, injectElement, is, sliceArgs } from "../helpers";
import { minErr } from "../minErr";
import { ERROR_MSG } from "../const";

implement({
    // Import external javascript files in the document, and call optional 
    // callback when it will be done. 
    injectScript() {
        var urls = sliceArgs(arguments),
            doc = this[0].ownerDocument,
            callback = () => {

                var arg = urls.shift(),
                    argType = typeof arg,
                    script;

                if (is(arg, "string")) {

                    script = doc.createElement("script");
                    script.onload = callback;

                    // Support: IE9
                    // Bug in IE force us to set the 'src' after the element has been
                    // added to the document.
                    injectElement(script);

                    script.src = arg;
                    script.async = true;
                    script.type = "text/javascript";

                } else if (is(arg, "function")) {
                    arg();
                } else if (arg) {
                    minErr("injectScript()", ERROR_MSG[3]);
                }
            };

        callback();
    }
});