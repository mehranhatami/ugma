import { uClass } from "./uclass";

var Node, Document,
    Element = uClass({
        constructor(node) {
                // 'this' will be 'undefined' if not instanceOf Element
                if (!(this)) {
                    return node ? node["<%= prop() %>"] || new Element(node) : new Node();
                }
                node["<%= prop() %>"] = this;
                this[0] = node;
                this._ = {};
            },
            // returns current running version
            version: "<%= pkg.version %>",
            // returns current running codename on this build
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

// Node class
Node = uClass(Element, {
    constructor: function() {},
    toString() {
        return "";
    }
});
// Document class
Document = uClass(Element, {
    constructor: function(node) {
        return Element.call(this, node.documentElement);
    },
    toString() {
        return "<document>";
    }

});
export { Element, Node, Document };