import { DOCUMENT, ugma, ERROR_MSG, HTML } from "../const";
import { nodeTree, dummyTree } from "../core";
import { minErr } from "../minErr";
import { is, map, implement, invoke } from "../helpers";

var rsibling = /[\x20\t\r\n\f]*[+~>]/,
    rquick = DOCUMENT.getElementsByClassName ? /^(?:(\w+)|\.([\w\-]+))$/ : /^(?:(\w+))$/,
    rescape = /'|\\/g;

implement({
    // Find the first matched element by css selector
    query: "",
    // Find all matched elements by css selector
    queryAll: "All"

}, (methodName, all) => function(selector) {
    if (typeof selector !== "string") minErr();

    var node = this[ 0 ],
        quickMatch = rquick.exec(selector),
        result, old, nid, context;

    if (quickMatch) {
        if (quickMatch[ 1 ]) {
            // speed-up: "TAG"
            result = node.getElementsByTagName( selector );
        } else {
            // speed-up: ".CLASS"
            result = node.getElementsByClassName( quickMatch[ 2 ] );
        }

        if (result && !all) result = result[ 0 ];
    } else {
        old = true;
        context = node;

        if (node !== node.ownerDocument.documentElement) {
            // qSA works strangely on Element-rooted queries
            // We can work around this by specifying an extra ID on the root
            // and working up from there (Thanks to Andrew Dupont for the technique)
            if ( (old = node.getAttribute( "id" )) ) {
                nid = old.replace( rescape, "\\$&" );
            } else {
                nid = "<%= prop('ugma') %>";
                node.setAttribute("id", nid);
            }

            nid = "[id='" + nid + "'] ";
            
            context = rsibling.test(selector) ? node.parentNode : node;
            
            selector = nid + selector.split(",").join("," + nid);
        }

        result = invoke(context, "querySelector" + all, selector);

        if (!old) node.removeAttribute("id");
    }

        return all ? map(result, nodeTree) : nodeTree(result);
        
}, (methodName, all) => () => all ? [] : new dummyTree());