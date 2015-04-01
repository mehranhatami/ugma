import { nodeTree, dummyTree       } from "../core";
import SelectorMatcher               from "../util/selectormatcher";
import { ERROR_MSG                 } from "../const";
import { implement, is, map        } from "../helpers";
import { minErr                    } from "../minErr";

implement({
    // Find first element
    first: "firstElementChild",
    // Find last element
    last: "lastElementChild",
    // Find next following sibling element filtered by optional selector
    next: "nextElementSibling",
    // Find previous preceding sibling element filtered by optional selector
    prev: "previousElementSibling",
    // Find all following sibling elements filtered by optional selector
    nextAll: "nextElementSibling",
    // Find all preceding sibling elements filtered by optional selector
    prevAll: "previousElementSibling",
}, (methodName, propertyName) => function(selector) {

    if (selector && !is(selector, "string")) minErr(methodName + "()", ERROR_MSG[ 1 ]);

    var all = methodName.slice( -3 ) === "All",
        matcher = SelectorMatcher(selector),
        descendants = all ? [] : null,
        currentNode = this[ 0 ];

    if (!matcher) currentNode = currentNode[propertyName];

    for (; currentNode; currentNode = currentNode[propertyName]) {
        if (currentNode.nodeType === 1 && (!matcher || matcher(currentNode))) {
            if ( !all ) break;

            descendants.push(currentNode);
        }
    }

    return all ? map(descendants, nodeTree) : nodeTree(currentNode);
}, (methodName) => () => methodName.slice( -3 ) === "All" ? [] : new dummyTree());