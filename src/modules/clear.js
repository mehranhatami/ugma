/**
 * @module clear
 */

import { implement    } from "../core/core";
import { RETURN_THIS  } from "../const";

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
    clear(name) { return this.set(name, null) }

}, null, () => RETURN_THIS);