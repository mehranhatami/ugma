import { WINDOW, DOCUMENT } from "./const";
import { uClass } from "./uclass";
var Node;

var Element = uClass({
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
    }
});


Node = uClass(Element, {
    constructor: function() {},
    toString: function() {
        return "";
    }

});


var Document = uClass(Element, {
    constructor: function(node) {
        return Element.call(this, node.documentElement);
    },
    toString: function() {
        return "<document>";
    }

});

export { Element, Node, Document };