/**
 * @module extend
 */

import { implement    } from "../core/core";
import { is, isArray  } from "../helpers"; 
import { minErr       } from "../minErr";
import { RETURN_THIS  } from "../const";

implement({
    /**
     * Extend ugma with methods
     * @param  {Object}    mixin       methods container
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
    extend(mixin, namespace) {
        if( !is( mixin, "object" )  || isArray( mixin ) ) minErr();
        return mixin ? namespace ? implement( mixin ) : implement( mixin, null, () => RETURN_THIS ) : false;
    }
});