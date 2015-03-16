import { WINDOW, DOCUMENT } from "./const";

function Node() {}

function Element(node) {

    if (!(this instanceof Element)) {
        return node ? node["<%= prop() %>"] || new Element(node) : new Node();
    }

    if (node) {
        node["<%= prop() %>"] = this;
        this[0] = node;
        this._ = {};
    }
}

Element.prototype.version = "<%= pkg.version %>";
Element.prototype.codename = "<%= pkg.codename %>",
    Element.prototype.toString = () => {
        var node = this[0];
        return node && node.tagName ? "<" + node.tagName.toLowerCase() + ">" : "";
    };

// Set correct document, and determine what kind it is.
function Document(node) {
    return Element.call(this, node.documentElement);
}

var proto = Object.create(Element.prototype);

// Document
Document.prototype = Object.create(Element.prototype);
Document.prototype.toString = () => "<document>";
// Node
Node.prototype = Object.create(Element.prototype);
Node.prototype.toString = () => "";
proto.constructor = Document;
proto.constructor = Node;

export { Element, Node, Document };