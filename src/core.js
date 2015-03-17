import { WINDOW, DOCUMENT } from "./const";
import { uClass } from "./uclass";

var Node, Document,
    Element = uClass({
        constructor: function(node) {
            if (this instanceof Element) {
                node["<%= prop() %>"] = this;
                this[0] = node;
                this._ = {};

            } else {
                return node ? node["<%= prop() %>"] || new Element(node) : new Node();
            }
        },
        // all of these placeholder strings will be replaced by gulps's
        version: "<%= pkg.version %>",
        codename: "<%= pkg.codename %>",
        toString() {
            var node = this[0];
            return node && node.tagName ? "<" + node.tagName.toLowerCase() + ">" : "";
        },
        // Create a ugma wrapper object for a native DOM element or a
        // jQuery element. E.g. (ugma.native($('#foo')[0]))
        native(node) {
            var nodeType = node && node.nodeType;
            // filter non elements like text nodes, comments etc.
            return (nodeType === 9 ?
                    Document :
                    Element
                )
                (
                    nodeType === 1 ||
                    nodeType === 9 ?
                    node :
                    null
                );
        }
    });

Node = uClass(Element, {
    constructor: function() {},
    toString: function() {
        return "";
    }
});

Document = uClass(Element, {
    constructor: function(node) {
        return Element.call(this, node.documentElement);
    },
    toString: function() {
        return "<document>";
    }

});

export { Element, Node, Document };