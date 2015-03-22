import { ugma, ERROR_MSG } from "../const";
import { minErr } from "../minErr";
import { Element } from "../core";
import tagCache from "../emmet/emmet";
import { implement, reduce, is, trim } from "../helpers";

implement({
    // Create a new Element from Emmet or HTML string in memory
    add: "",
    // Create a new array of Element from Emmet or HTML string in memory
    addAll: "All"

}, (methodName, all) => function(value, varMap, attributes, styles) {

    var doc = this[0].ownerDocument,
        sandbox = this._["<%= prop('sandbox') %>"] || (this._["<%= prop('sandbox') %>"] = doc.createElement("div"));

    var nodes, el;

    if (value && value in tagCache) {

        if (!is(value, "string")) {
            minErr(methodName + "()", ERROR_MSG[7]);
        }

        nodes = doc.createElement(value);

        if (all) nodes = [new Element(nodes)];
    } else {
        value = trim(value);
        // handle vanila HTML strings
        // e.g. <div id="foo" class="bar"></div>
        if (value[0] === "<" && value[value.length - 1] === ">" && value.length >= 3) {
            
            value = varMap ? ugma.format(value, varMap) : value;
            
            // styles
            if (styles && is(styles, "object")) value.css(styles);
            
            // attributes
            if (attributes && is(attributes, "object")) value.set(attributes);
            
        } else { // emmet strings
            value = ugma.emmet(value, varMap);
        }

        sandbox.innerHTML = value; // parse input HTML string

        nodes = all ? [] : null;

        if (sandbox.childNodes.length === 1 && sandbox.firstChild.nodeType === 1) {
            nodes = sandbox.removeChild(sandbox.firstChild);
        } else {

            for (; el = sandbox.firstChild;) {
                sandbox.removeChild(el); // detach element from the sandbox

                if (el.nodeType === 1) {
                    nodes.push(new Element(el));
                }
            }
        }
    }

    return all ? nodes : Element(nodes);
});