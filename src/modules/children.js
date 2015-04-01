import { minErr                      } from "../minErr";
import { nodeTree, dummyTree         } from "../core";
import   SelectorMatcher               from "../util/selectormatcher";
import { implement, map, filter, is  } from "../helpers";

implement({
    // returns the first child node in a collection of children
    child: false,
    // returns all child nodes in a collection of children
    children: true

}, (methodName, all) => function(selector) {
        if (selector && (!is(selector, all ? "string" : "number") ) ) {
            minErr( methodName + "()", selector + " is not a " + ( all ? " string" : " number" ) + " value" );
        }

    var node = this[ 0 ],
        matcher = SelectorMatcher( selector ),
        children = node.children;

    if (all) {
        if ( matcher ) children = filter( children, matcher );

        return map( children, nodeTree );
    } else {
        if ( selector < 0 ) selector = children.length + selector;

        return nodeTree( children[ selector ] );
    }
}, ( methodName, all ) => () => all ? [] : new dummyTree() );
