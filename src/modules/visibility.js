/**
 * @module visibility
 */

import { ugma                          } from "../core/core";
import { RETURN_THIS                   } from "../const";
import { implement, is, computeStyle   } from "../helpers";
import { minErr                        } from "../minErr";
import { requestFrame, cancelFrame     } from "../util/raf";

implement({
    /**
     * Show an element
     * @param {Function} [callback]
     * @chainable
     * @example
     *    link.show(); // displays element
     *
     *    foo.show(function() { });
     */
    show: false,
    /**
     * Hide an element
     * @param {Function} [callback]
     * @chainable
     * @example
     * link.hide(); // hides element
     *
     * foo.hide(function() { });
     */
    hide: true,

    /**
     * Toggle an element
     * @param {Boolean}  
     * @param {Function} [callback]
     * @chainable
     * @example
     * link.toggle(); // toggles element visibility
     *
     * link.toggle(true); // forces 'true' state
     *
     * link.toggle(false); // forces 'false' state
     *
     * foo.toggle(function() { });
     */
    toggle: null

}, ( methodName, condition ) => function( state, callback ) {

    // Boolean toggle()
    if ( methodName === "toggle" && is( state, "boolean" ) ) {
        condition = state;
        state = null;
    }

    if ( !is(state, "string" ) ) {
        callback = state;
        state = null;
    }

    if ( callback && !is( callback, "function") ) minErr( methodName + "()", "This operation is not supported" );

    var node = this[ 0 ],
        style = node.style,
        computed = computeStyle( node ),
        isHidden = condition,
        frameId = this._._frame,
        done = () => {
            this.set( "aria-hidden", String( isHidden ) );

            style.visibility = isHidden ? "hidden" : "inherit";

            this._._frame = null;

            if ( callback ) callback( this );
        };

    if ( !is(isHidden, "boolean" ) ) isHidden = computed.visibility !== "hidden";

    // cancel previous frame if it exists
    if ( frameId ) cancelFrame( frameId );

    if ( !node.ownerDocument.documentElement.contains( node ) ) {
        done();
    } else {
        this._._frame = requestFrame( done );
    }

    return this;

}, () => () => RETURN_THIS );