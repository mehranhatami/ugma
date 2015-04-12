/**
 * @module format
 */

import { ugma } from "../core/core";
import { is   } from "../helpers";

var reVar = /\{([\w\-]+)\}/g;

// 'format' a placeholder value with it's original content 
// @example
// ugma.format('{0}-{1}', [0, 1]) equal to '0-1')
ugma.format = ( template, ValueMap ) => {
    // Enforce data types on user input
    if ( !is( template, "string" ) ) template = String( template );

    if ( !ValueMap || !is(ValueMap, "object") ) ValueMap = {};

    return template.replace( reVar, ( placeholder, name, index ) => {
        if ( name in ValueMap ) {
            placeholder = ValueMap[ name ];

            if ( is( placeholder, "function") ) placeholder = placeholder( index );

            placeholder = String(placeholder);
        }

        return placeholder;
    });
};