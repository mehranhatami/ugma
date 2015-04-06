/**
 * @module offsetparent
 */

import { each, invoke          } from "../helpers";

import { nodeTree           } from "../core/core";

import { minErr           } from "../minErr";

import { RETURN_FALSE, RETURN_TRUE, WINDOW, HTML } from "../const";

import SelectorMatcher from "../util/selectormatcher";

import { implement       } from "../core/core";

var ExtensionHandler = (selector, condition, mixins, index) => {
    var ctr = mixins.hasOwnProperty("constructor") && mixins.constructor,
        matcher = SelectorMatcher(selector);

    return (node, mock) => {
        var el = nodeTree(node),
            extension = el._.extension;

        if (!extension) {
            el._.extension = extension = [];
        }

        // skip previously invoked or mismatched elements
        if (~extension.indexOf(index) || !matcher(node)) return;
        // mark extension as invoked
        extension.push(index);

        if (mock === true || condition(el) !== false) {
            // apply all private/public members to the element's interface
            var privateFunctions = Object.keys(mixins).filter((prop) => {
                var value = mixins[prop];

                if (prop !== "constructor") {
                    el[prop] = value;

                    return !mock && prop[0] === "_";
                }
            });

            // invoke constructor if it exists
            // make a safe call so live extensions can't break each other
            if (ctr) invoke(el, ctr);
            // remove event handlers from element's interface
            privateFunctions.forEach((prop) => {
                delete el[prop];
            });
        }
    };
};


implement({

    mutate(selector, condition, definition) {

        if (arguments.length === 2) {
            definition = condition;
            condition = true;
        }

        if (typeof condition === "boolean") condition = condition ? RETURN_TRUE : RETURN_FALSE;
        if (typeof definition === "function") definition = {
            constructor: definition
        };

        if (!definition || typeof definition !== "object" || typeof condition !== "function") minErr();

        var node = this[0],
            mappings = this._.mutations;

        if (!mappings) {
            this._.mutations = mappings = [];
        }

        var ext = ExtensionHandler(selector, condition, definition, mappings.length);

        mappings.push(ext);
        // live extensions are always async - append CSS asynchronously
        WINDOW.setTimeout(() => {
            each(node.ownerDocument.querySelectorAll(selector), ext);
        }, 0);


    }
});