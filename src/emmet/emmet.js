import { ugma } from "../core";
import { is, each } from "../helpers";
import { ERROR_MSG } from "../const";
import { minErr } from "../minErr";
// emmet modules
import { process } from "../emmet/process";
import operators from "../emmet/operators";

/* es6-transpiler has-iterators:false, has-generators: false */

// Reference: https://github.com/emmetio/emmet

var reParse = /`[^`]*`|\[[^\]]*\]|\.[^()>^+*`[#]+|[^()>^+*`[#.]+|\^+|./g,
    reDot = /\./g,
    tagCache = {
        "": ""
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

    return process(output);
};

// populate empty tag names with result
each("area base br col hr img input link meta param command keygen source".split(" "), (tag) => {
    tagCache[tag] = "<" + tag + ">";
});

export default tagCache;