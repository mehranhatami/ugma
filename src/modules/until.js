import { Element, Node } from "../core";
import SelectorMatcher from "../util/selectormatcher";
import { implement, is, map } from "../helpers";

implement({
    // Get all preceding siblings of each element up to 
    // but not including the element matched by the CSS selector.
    prevUntil: "previousElementSibling",
    // Get all following siblings of each element up to 
    // but not including the element matched by the CSS selector.
    nextUntil: "nextElementSibling",
}, (methodName, propertyName) => function(selector, direction) {

    var currentNode = this[0],
        descendants = [],
        matcher = SelectorMatcher(selector);

    if (!is(selector, "string")) {
        // if no valid CSS selector, return either prevAll() or nextAll()
        return this[methodName.replace("Until", "All")]();
    }

    while ((currentNode = currentNode[direction])) {
        if (currentNode.nodeType === 1) {
            if (matcher(currentNode)) {
                break;
            }
        }
        descendants.push(currentNode);
    }

    return map(descendants, Element);

}, () => () => new Node());