import { ugma, RETURN_THIS } from "../const";
import { Element } from "../core";
import { minErr } from "../minErr";
import { implement, isArray, trim, each, is } from "../helpers";

// https://dom.spec.whatwg.org
// 
// Section: 4.2.5 Interface ChildNode

implement({
    // Inserts nodes after the last child of node, while replacing strings 
    // in nodes with native element or equivalent html string.
    append: ["beforeend", true, false, (node, relatedNode) => {
        node.appendChild(relatedNode);
    }],
    // Inserts nodes before the first child of node, while replacing strings 
    // in nodes with native element or equivalent html strings.
    prepend: ["afterbegin", true, false, (node, relatedNode) => {
        node.insertBefore(relatedNode, node.firstChild);
    }],
    // Insert nodes just before node while replacing strings in nodes with 
    // native element or a html string.
    before: ["beforebegin", true, true, (node, relatedNode) => {
        node.parentNode.insertBefore(relatedNode, node);
    }],
    // Insert nodes just after node while replacing strings in nodes with 
    // native element or a html string .
    after: ["afterend", true, true, (node, relatedNode) => {
        node.parentNode.insertBefore(relatedNode, node.nextSibling);
    }],
    // Replaces node with nodes, while replacing strings in nodes with 
    // native element or html string.
    replaceWith: ["", false, true, (node, relatedNode) => {
        node.parentNode.replaceChild(relatedNode, node);
    }],
    remove: ["", false, true, (node) => {
        node.parentNode.removeChild(node);
    }]
}, (methodName, adjacentHTML, native, requiresParent, strategy) => function(...contents) {
    var node = this[0];

    if (requiresParent && !node.parentNode) return this;

    if ((methodName === "after" || methodName === "before") && this === ugma) {
         minErr(methodName + "()", "You can not  " + methodName + " an element non-existing HTML (documentElement)");
    }
    
    // don't create fragment for adjacentHTML
    var fragment = adjacentHTML ? "" : node.ownerDocument.createDocumentFragment();

    contents.forEach((content) => {

        // Handle native DOM elements 
        // e.g. link.append(document.createElement('li'));
        if (native && content.nodeType === 1) {
            content = Element.toString(content);
        }

        if (is(content, "function")) {
            content = content(this);
        }

        // merge a 'pure' array into a string
        if (isArray(content) && !is(content[0], "object")) {
            content = content.join();
        }

        if (is(content, "string")) {
            if (is(fragment, "string")) {
                fragment += trim(content);
            } else {
                content = ugma.addAll(content);
            }
        } else if (content._) {
            content = [content];
        }
        
        // should handle documentFragment
        if (content.nodeType === 11) {
            fragment = content;
        } else {
            if (isArray(content)) {
                if (is(fragment, "string")) {
                    // append existing string to fragment
                    content = ugma.addAll(fragment).concat(content);
                    // fallback to document fragment strategy
                    fragment = node.ownerDocument.createDocumentFragment();
                }

                each(content, function(el) {
                    fragment.appendChild(el._ ? el[0] : el);
                });
            }
        }
    });

    if (is(fragment, "string")) {
        node.insertAdjacentHTML(adjacentHTML, fragment);
    } else {
        strategy(node, fragment);
    }

    return this;
}, () => RETURN_THIS);