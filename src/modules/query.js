import { DOCUMENT, ugma, ERROR_MSG, HTML } from "../const";
import { nodeTree, Node } from "../core";
import { minErr } from "../minErr";
import { is, map, implement, invoke } from "../helpers";

var unionSplit = /([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,
    rquick = /^(?:(\w+)|\.([\w\-]+))$/,
    rescape = /'|\\/g,
    useRoot = function(context, query, method) {

        // create a temporary id for rooted qSA queries
        var oldContext = context,
            old = context.getAttribute("id"),
            nid = old || "<%= prop() %>",
            hasParent = context.parentNode,
            relativeHierarchySelector = /^\s*[+~]/.test(query);

        if (relativeHierarchySelector && !hasParent) {
            return [];
        }
        if (!old) {
            context.setAttribute("id", nid);
        } else {
            nid = nid.replace(/'/g, "\\$&");
        }
        if (relativeHierarchySelector && hasParent) {
            context = context.parentNode;
        }
        var selectors = query.match(/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g),
            i = 0, len = selectors.length;
        
        for (; i < len; i++) {
            selectors[i] = "[id='" + nid + "'] " + selectors[i];
        }
        query = selectors.join(",");

        try {
            return method.call(context, query);
        } finally {
            if (!old) {
                oldContext.removeAttribute("id");
            }
        }
    };

implement({
    // Find the first matched element by css selector
    query: "",
    // Find all matched elements by css selector
    queryAll: "All"

}, (methodName, all) => function(selector) {
    if (!is(selector, "string")) minErr(methodName + "()", ERROR_MSG[4]);

    var node = this[0],
        quickMatch = rquick.exec(selector),
        result, old, nid, context;
    if (quickMatch) {
        if (quickMatch[1]) {
            // speed-up: "TAG"
            result = node.getElementsByTagName(selector);
        } else {
            // speed-up: ".CLASS"
            result = node.getElementsByClassName(quickMatch[2]);
        }
        if (result && !all) result = result[0];
    } else {

        if (node !== node.ownerDocument.documentElement) {
            result = useRoot(node, selector, node["querySelector" + all]);
        } else {
            result = invoke(node, "querySelector" + all, selector);
        }
    }


    return all ? map(result, nodeTree) : nodeTree(result);
}, (methodName, all) => () => all ? [] : new Node());