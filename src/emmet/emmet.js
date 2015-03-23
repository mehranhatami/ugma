import { ugma } from "../core";
import { is, each } from "../helpers";
import { ERROR_MSG } from "../const";
import { minErr } from "../minErr";

// emmet parser modules
import { parseAttr } from "../emmet/parseAttr";
import { injection } from "../emmet/injection";
import { processTag } from "../emmet/processTag";
import { indexing } from "../emmet/indexing";

/* es6-transpiler has-iterators:false, has-generators: false */
var // operator type / priority object
    operators = {
        "(": 1,
        ")": 2,
        "^": 3,
        ">": 4,
        "+": 5,
        "*": 6,
        "`": 7,
        "[": 8,
        ".": 8,
        "#": 8
    },
    reParse = /`[^`]*`|\[[^\]]*\]|\.[^()>^+*`[#]+|[^()>^+*`[#.]+|\^+|./g,
    reAttr = /\s*([\w\-]+)(?:=((?:`([^`]*)`)|[^\s]*))?/g,
    reDot = /\./g,
    tagCache = {
        "": ""
    },
    badChars = /[&<>"']/g,
    charMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
    };

ugma.emmet = function(template, varMap) {

    if (!is(template, "string")) minErr("emmet()", ERROR_MSG[2]);

    if (varMap) template = ugma.format(template, varMap);
    // If already cached, return the cached result
    if (template in tagCache) return tagCache[template];

    // transform template string into RPN

    var stack = [],
        output = [],
        matched = template.match(reParse);

    each(matched, function(str) {

        let op = str[0];

        if (operators[op]) {
            if (str !== "(") {
                // for ^ operator need to skip > str.length times
                for (let i = 0, n = (op === "^" ? str.length : 1); i < n; ++i) {
                    while (stack[0] !== op && operators[stack[0]] >= operators[op]) {
                        let head = stack.shift();

                        output.push(head);
                        // for ^ operator stop shifting when the first > is found
                        if (op === "^" && head === ">") break;
                    }
                }
            }

            if (str === ")") {
                stack.shift(); // remove "(" symbol from stack
            } else {
                // handle values inside of `...` and [...] sections
                if (op === "[" || op === "`") {
                    output.push(str.slice(1, -1));
                }
                // handle multiple classes, e.g. a.one.two
                if (op === ".") {
                    output.push(str.slice(1).replace(reDot, " "));
                }

                stack.unshift(op);
            }
        } else {
            output.push(str);
        }
    });

    output = output.concat(stack);

    // transform RPN into html nodes

    stack = [];

    each(output, function(str) {
        if (str in operators) {
            let value = stack.shift();
            let node = stack.shift();

            if (typeof node === "string") {
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
                node = [value.replace(badChars, (ch) => charMap[ch])];
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
};

// populate empty tag names with result
each("area base br col hr img input link meta param command keygen source".split(" "), (tag) => {
    tagCache[tag] = "<" + tag + ">";
});


export default tagCache;