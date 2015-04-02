import { ugma } from "../core/core";
import { is   } from "../helpers";

var reVar = /\{([\w\-]+)\}/g;

// 'format' a placeholder value with it's original content 
// @example
// ugma.format('{0}-{1}', [0, 1]) equal to '0-1')
ugma.format = function(template, varMap) {
    if (!is(template, "string")) template = template + "";

    if ( !varMap || !is(varMap, "object") ) varMap = {};

    return template.replace(reVar, (placeholder, name, index) => {
        if ( name in varMap ) {
            placeholder = varMap[ name ];

            if ( is( placeholder, "function") ) placeholder = placeholder( index );

            placeholder = placeholder + "";
        }

        return placeholder;
    });
};