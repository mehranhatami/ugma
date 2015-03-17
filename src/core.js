import { WINDOW, DOCUMENT } from "./const";

function Node() {}

// Ugma are presented as a node tree similar to DOM Living specs
function Element(node) {

    if (this instanceof Element) {
        node["<%= prop() %>"] = this;
        this[0] = node;
        this._ = {};

    } else {
        return node ? node["<%= prop() %>"] || new Element(node) : new Node();
    }
}

// Set correct document, and determine what kind it is.
function Document(node) {
    return Element.call(this, node.documentElement);
}

Element.prototype = {
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
};

// inheritance
Document.prototype = Object.create(Element.prototype);
Node.prototype = Object.create(Element.prototype);
// both 'Document' and 'Node' need a overloaded toString 
Document.prototype.toString = () => "<document>";
Node.prototype.toString = () => "";

export { Element, Node, Document };