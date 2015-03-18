import { DOCUMENT, HTML, VENDOR_PREFIXES } from "../const";
import { minErr } from "../minErr";
import { is } from "../helpers";
import { vendorPrefixed } from "../util/vendorPrefixed";

/* es6-transpiler has-iterators:false, has-generators: false */
// Support: IE9
// Check for diconected nodes
var disconMatch = !!HTML[vendorPrefixed].call(DOCUMENT.createElement("div"), "div"),
    rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/;

export default function(selector, context) {
    if (!is(selector, "string")) return null;

    var quick = rquickIs.exec(selector);

    if (quick) {
        if (quick[1]) quick[1] = quick[1].toLowerCase();
        if (quick[3]) quick[3] = quick[3].split("=");
        if (quick[4]) quick[4] = " " + quick[4] + " ";
    }

    return function(node) {
        var result, found;
        /* istanbul ignore if */
        if (!quick && vendorPrefixed) {
            found = (context || node.ownerDocument).querySelectorAll(selector);
        }

        for (; node && node.nodeType === 1; node = node.parentNode) {
            if (quick) {
                result = (
                    (!quick[1] || node.nodeName.toLowerCase() === quick[1]) &&
                    (!quick[2] || node.id === quick[2]) &&
                    (!quick[3] || (quick[3][1] ? node.getAttribute(quick[3][0]) === quick[3][1] : node.hasAttribute(quick[3][0]))) &&
                    (!quick[4] || (" " + node.className + " ").indexOf(quick[4]) >= 0)
                );
            } else {
                // If vendor prefixed, and support for disconnected nodes (IE9+), go on...
                /* istanbul ignore else */
                if (!vendorPrefixed && disconMatch) {
                    // use try/catch in case someone try a unexpected
                    // and non-supported selector (e.g. ':hello');
                    try {
                        result = node[vendorPrefixed](selector);
                    } catch (e) {
                        // Use a nice error message rather then a ugla throw :)
                        minErr("matches()", "Not a supported selector.");
                    }
                } else {
                    for (let n of found) {
                        if (n === node) return n;
                    }
                }
            }

            if (result || !context || node === context) break;
        }

        return result && node;
    };
}