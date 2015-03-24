import { ugma } from "../core";
import { is } from "../helpers";

var reVar = /\{([\w\-]+)\}/g;

// 'format' a placeholder value with it's original content 
// @example
// ugma.format('{0}-{1}', [0, 1]) equal to '0-1')
ugma.format = function(tmpl, varMap) {
    if (!is(tmpl, "string")) tmpl = String(tmpl);

    if (!varMap || !is(varMap, "object")) varMap = {};

    return tmpl.replace(reVar, (x, name, index) => {
        if (name in varMap) {
            x = varMap[name];

            if (is(x, "function")) x = x(index);

            x = String(x);
        }

        return x;
    });
};