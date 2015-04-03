/**
 * @module extend
 */

import { implement    } from "../helpers"; 
import { RETURN_THIS  } from "../const";

implement({
    /**
     * Extend ugma with methods
     * @param  {Object}    obj       methods container
     * @param  {Boolean} namespace  indicates if the method should be attached to ugma namespace or not
     * @example
     * ugma.extend({
     *     foo: function() {
     *         console.log("bar");
     *     }
     * });
     *
     * ugma.extend({
     *     foo: function() {
     *         console.log("bar");
     *     }
     * }, true);
     *
     *
     * Note! If 'namespace' set to true, the methods can be used like:
     *
     *   ugma.foo();
     *
     * otherwise:
     *
     *   link.foo();
     */
    extend(obj, namespace) {
        return obj ? namespace ? implement(obj) : implement(obj, null, () => RETURN_THIS) : false;
    }
});