import { ugma } from "../const";
import { is } from "../helpers";
import { ERROR_MSG } from "../const";
import { minErr } from "../minErr";
/* es6-transpiler has-iterators:false, has-generators: false */

var // operator type / priority object
    operators = {"(": 1,")": 2,"^": 3,">": 4,"+": 5,"*": 6,"`": 7,"[": 8,".": 8,"#": 8},
    reParse = /`[^`]*`|\[[^\]]*\]|\.[^()>^+*`[#]+|[^()>^+*`[#.]+|\^+|./g,
    reAttr = /\s*([\w\-]+)(?:=((?:`([^`]*)`)|[^\s]*))?/g,
    reIndex = /(\$+)(?:@(-)?(\d+)?)?/g,
    reDot = /\./g,
    reDollar = /\$/g,
    tagCache = {"": ""},
    parseAttr = (_, name, value, rawValue) => {
        // try to detemnie which kind of quotes to use
        var quote = value && value.indexOf("\"") >= 0 ? "'" : "\"";

        if (is(rawValue, "string")) {
            // grab unquoted value for smart quotes
            value = rawValue;
        } else if (!is(value, "string")) {
            // handle boolean attributes by using name as value
            value = name;
        }
        // always wrap attribute values with quotes even they don't exist
        return " " + name + "=" + quote + value + quote;
    },
    injection = (term, adjusted) => (html) => {
        // find index of where to inject the term
        var index = adjusted ? html.lastIndexOf("<") : html.indexOf(">");
        // inject the term into the HTML string
        return html.slice(0, index) + term + html.slice(index);
    },
    processTag = (tag) => {
        return tagCache[tag] || (tagCache[tag] = "<" + tag + "></" + tag + ">");
    },
   
   
    indexing = (num, term) => {
       var stricted = num >= 1500 ? /* max 1500 HTML elements */ 1500 : (num <= 0 ? 1 : num),
           result = new Array(stricted),
          i = 0;

        for (;i < num; ++i) {
            result[i] = term.replace(reIndex, (expr, fmt, sign, base) => {
                var index = (sign ? num - i - 1 : i) + (base ? +base : 1);
                // handle zero-padded index values, like $$$ etc.
                return (fmt + index).slice(-fmt.length).replace(reDollar, "0");
            });
        }
        return result;  
    },
    badChars = /[&<>"']/g,
    // http://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
    charMap = {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"};

// populate empty tag names with result
"area base br col hr img input link meta param command keygen source".split(" ").forEach((tag) => {
    tagCache[tag] = "<" + tag + ">";
});

ugma.emmet = function(template, varMap) {

    if (!is(template, "string")) minErr("emmet()", ERROR_MSG[2]);

    if (varMap) template = ugma.format(template, varMap);
 // If already cached, return the cached result
    if (template in tagCache) return tagCache[template];

    // transform template string into RPN

    var stack = [], output = [];


    for (let str of template.match(reParse)) {
        let op = str[0];
        let priority = operators[op];

        if (priority) {
            if (str !== "(") {
                // for ^ operator need to skip > str.length times
                for (let i = 0, n = (op === "^" ? str.length : 1); i < n; ++i) {
                    while (stack[0] !== op && operators[stack[0]] >= priority) {
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
    }

    output = output.concat(stack);

    // transform RPN into html nodes

    stack = [];

    for (let str of output) {
        if (str in operators) {
            let value = stack.shift();
            let node = stack.shift();

            if (typeof node === "string") {
                node = [ processTag(node) ];
            }

           if (is(node, "undefined") || is(value, "undefined")) {
               minErr("emmet()", ERROR_MSG[4]);
           }
                    
            if(str === ".") { // class
                value = injection(" class=\"" + value + "\"");            
            } else if(str === "#") { // id
                value = injection(" id=\"" + value + "\"");
            } else if(str === "[") { // id
                value = injection(value.replace(reAttr, parseAttr));
            } else if(str === "*") { // universal selector 
                node = indexing(+value, node.join(""));
            } else if(str === "`") { // Back tick
                stack.unshift(node);
                // escape unsafe HTML symbols
                node = [ value.replace(badChars, (ch) => charMap[ch]) ];
            } else {  /* ">", "+", "^" */
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
    }

    if (output.length === 1) {
        // handle single tag case
        output = processTag(stack[0]);
    } else {
        output = stack[0].join("");
    }

    return output;
};

export default tagCache;
