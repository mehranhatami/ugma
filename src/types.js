import { WINDOW, DOCUMENT } from "./const";

function Node() {}

function Element(node) {

    if (this instanceof Element) {

        node["<%= prop() %>"] = this;

        this[0] = node;
        this._ = {};

    } else if (node) {
        // create a wrapper only once for each native element
        return node["<%= prop() %>"] || new Element(node);
    } else {
        return new Node();
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

  Document.prototype = Object.create(Element.prototype, { constructor: Element}); 
  Document.prototype.toString = () => "<document>";
  Node.prototype = Object.create(Element.prototype, { constructor: Element});  
  Node.prototype.toString = () => "";

export { Element, Node, Document };