/**
 * @module clear
 */

import { implement       } from "../core/core";
import { RETURN_FALSE    } from "../const";
import   accessorhooks     from "../util/accessorhooks";

implement({
    /**
     * Clear a property/attribute on the node
     * @param  {String}   name    property/attribute name
     * @example 
     *
     *   <a id='test' href='#'>set-test</a><input id='set_input'/><input id='set_input1'/><form id='form' action='formaction'>
     *
     *      ugma.query("#test").has("checked");
     *      // false
     *
     *      ugma.query("#test").set("checked", "checked");
     *
     *      ugma.query("#test").has("checked");
     *      // true
     *
     *     ugma.query("#test").clear("checked");
     *
     *     ugma.query("#test").has("checked");
     *     // false
     */
    clear(name) {

        var node = this[0],
            lowercasedName = name.toLowerCase();

        // Check for boolean attributes
        if (accessorhooks.booleans[lowercasedName]) {
            // Set corresponding property to false
            node[name] = false;
            node.removeAttribute(lowercasedName);
        } else {
            node.removeAttribute(name);
        }
        return this;
    }

}, null, () => RETURN_FALSE);