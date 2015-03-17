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

Element.prototype = {
    // all of these placeholder strings will be replaced by gulps's
    version: "<%= pkg.version %>",
    codename: "<%= pkg.codename %>",

    toString() {
        var node = this[0];
        return node && node.tagName ? "<" + node.tagName.toLowerCase() + ">" : "";
    }
};


// Set correct document, and determine what kind it is.
function Document(node) {
    return Element.call(this, node.documentElement);
}

// Prototype chain with Object.create() + assign constructor
Document.prototype = Object.create(Element.prototype);
Document.prototype.constructor = Document;
Node.prototype = Object.create(Element.prototype);
Node.prototype.constructor = Node;
// both 'Document' and 'Node' need a overloaded toString 
Document.prototype.toString = () => "<document>";
Node.prototype.toString = () => "";

export { Element, Node, Document };