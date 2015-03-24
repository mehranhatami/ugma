import { DOCUMENT, HTML, VENDOR_PREFIXES } from "../const";
import { minErr } from "../minErr";
import { is, map } from "../helpers";

// Refereence: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
/* es6-transpiler has-iterators:false, has-generators: false */
var rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,
    matchesSelector,
    matchesMethod = map(VENDOR_PREFIXES.concat(null), function(p) {
        return (p ? p.toLowerCase() + "M" : "m") + "atchesSelector";
    }).reduceRight(function(propName, p) {
        return propName ||
            // Support: Chrome 34+, Gecko 34+, Safari 7.1, IE10+ (unprefixed)
            (HTML.matches && "matches" ||
            // Support: Chome <= 33, IE9, Opera 11.5+,  (prefixed)
            p in HTML && p);
    }, null),
    match = (node, selector) => node[matchesMethod](selector),
    checkParent = (node) => {
        // return if already has a parent
        if (node.parentNode) return;

        var fragment = DOCUMENT.createDocumentFragment();
        fragment.appendChild(node);
    },
    query = (node, selector) => {
        // append to fragment if no parent
        checkParent(node);

        // match elem with all selected elems of parent
        var i = 0,
            elems = node.parentNode.querySelectorAll(selector),
            len = elems.length;

        for (; i < len; i++) {
            // return true if match
            if (elems[i] === node) return true;
        }
        // otherwise return false
        return false;
    },

    matchChild = (node, selector) => {
        checkParent(node);
        return match(node, selector);
    };


if (matchesMethod) {
    // IE9 supports matchesSelector, but doesn't work on orphaned elems
    // check for that
    var div = DOCUMENT.createElement("div"),
        supportsOrphans = match(div, "div");
    matchesSelector = supportsOrphans ? match : matchChild;
} else {
    matchesSelector = query;
}

export default function(selector, context) {

    if (is(selector, "string")) {

        var quick = rquickIs.exec(selector);

        if (quick) {
            if (quick[1]) quick[1] = quick[1].toLowerCase();
            if (quick[3]) quick[3] = quick[3].split("=");
            if (quick[4]) quick[4] = " " + quick[4] + " ";
        }

        return function(node) {
            var result, found;

            for (; node && node.nodeType === 1; node = node.parentNode) {
                if (quick) {
                    result = (
                        (!quick[1] || node.nodeName.toLowerCase() === quick[1]) &&
                        (!quick[2] || node.id === quick[2]) &&
                        (!quick[3] || (quick[3][1] ? node.getAttribute(quick[3][0]) === quick[3][1] : node.hasAttribute(quick[3][0]))) &&
                        (!quick[4] || (" " + node.className + " ").indexOf(quick[4]) >= 0)
                    );
                } else {
                    result = matchesSelector(node, selector);
                }

                if (result || !context || node === context) break;
            }

            return result && node;
        };
    }
    return null;
}