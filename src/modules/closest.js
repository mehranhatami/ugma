import { Element, Node } from "../core";
import SelectorMatcher from "../util/selectormatcher";
import { ERROR_MSG } from "../const";
import { implement, is } from "../helpers";
import { minErr } from "../minErr";

implement({
    // Find parent element filtered by optional selector 
    // Following the Element#closest specs  
    // https://dom.spec.whatwg.org/#dom-element-closest 
    closest(selector) {
        if (selector && !is(selector, "string")) minErr("closest()", ERROR_MSG[1]);

        var matcher = SelectorMatcher(selector),
            currentNode = this[0];

        if (!matcher) {
            currentNode = currentNode.parentElement;
        }

        for (; currentNode; currentNode = currentNode.parentElement) {
            if (currentNode.nodeType === 1 && (!matcher || matcher(currentNode))) {
                break;
            }
        }

        return Element(currentNode);
    }
}, null, () => () => new Node());