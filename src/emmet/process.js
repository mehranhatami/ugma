import { ugma } from "../core";
import { is, each } from "../helpers";
import { ERROR_MSG } from "../const";
import { minErr } from "../minErr";

// emmet modules
import { parseAttr } from "../emmet/parseAttr";
import { injection } from "../emmet/injection";
import { processTag } from "../emmet/processTag";
import { indexing } from "../emmet/indexing";
import operators from "../emmet/operators";

/* es6-transpiler has-iterators:false, has-generators: false */

var reAttr = /\s*([\w\-]+)(?:=((?:`([^`]*)`)|[^\s]*))?/g,
    charMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
    },
    // filter for escaping unsafe XML characters: <, >, &, ', "
     escapeChars = (str)  => str.replace(/[&<>"']/g, (ch) => charMap[ch]);

function process(output) {

    var stack = [];

    each(output, function(str) {
        if (str in operators) {
            let value = stack.shift();
            let node = stack.shift();

            if (is(node, "string")) {
                node = [processTag(node)];
            }

            if (is(node, "undefined") || is(value, "undefined")) {
                minErr("emmet()", ERROR_MSG[4]);
            }

            if (str === ".") { // class
                value = injection(" class=\"" + value + "\"");
            } else if (str === "#") { // id
                value = injection(" id=\"" + value + "\"");
            } else if (str === "[") { // id
                value = injection(value.replace(reAttr, parseAttr));
            } else if (str === "*") { // universal selector 
                node = indexing(+value, node.join(""));
            } else if (str === "`") { // Back tick
                stack.unshift(node);
                // escape unsafe HTML symbols
                node = [escapeChars(value)];
            } else { /* ">", "+", "^" */
                value = is(value, "string") ? processTag(value) : value.join("");

                if (str === ">") {
                    value = injection(value, true);
                } else {
                    node.push(value);
                }
            }

            str = is(value, "function") ? node.map(value) : node;
        }

        stack.unshift(str);
    });

    if (output.length === 1) {
        // handle single tag case
        output = processTag(stack[0]);
    } else {
        output = stack[0].join("");
    }

    return output;
}

export { process };