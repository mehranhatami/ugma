import { nodeTree, dummyTree } from "../core";
import SelectorMatcher from "../util/selectormatcher";
import { ERROR_MSG } from "../const";
import { implement, is } from "../helpers";
import { minErr } from "../minErr";

// Reference: https://dom.spec.whatwg.org/#dom-element-closest 

implement({
    // Find parent element filtered by optional selector 
    // Following the Element#closest specs  
    closest(selector) {
        if (selector && !is(selector, "string")) minErr("closest()", ERROR_MSG[1]);

        var matches = SelectorMatcher(selector),
            parentNode = this[0];
        
        // document has no .matches
        if (!matches) {
            parentNode = parentNode.parentElement;
        }

        for (; parentNode; parentNode = parentNode.parentElement) {
            if (parentNode.nodeType === 1 && (!matches || matches(parentNode))) {
                break;
            }
        }

        return nodeTree(parentNode);
    }
}, null, () => () => new dummyTree());