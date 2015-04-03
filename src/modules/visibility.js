/**
 * @module visibility
 */

import { ugma                          } from "../core/core";
import { RETURN_THIS                   } from "../const";
import { implement, is, computeStyle   } from "../helpers";
import { minErr                        } from "../minErr";
import { requestFrame, cancelFrame } from "../util/raf";

implement({
        // Show a single element
        show: false,
        // Hide a single element
        hide: true,
        // Toggles the CSS `display` of `element`
        toggle: null

    }, ( methodName, condition ) => function( state, callback ) {

        // Boolean toggle()
        if ( methodName === "toggle" && is( state, "boolean" ) ) {
            condition = state;
            state = null;
        }

        if ( !is( state, "string" ) ) {
            callback = state;
            state = null;
        }

        if ( callback && typeof callback !== "function") {
            minErr( methodName + "()", "This operation is not supported" );
        }

        var node = this[ 0 ],
            style = node.style,
            computed = computeStyle( node ),
            hiding = condition,
            frameId = this._._frame,
            done = () => {
                this.set("aria-hidden", String( hiding ) );

                style.visibility = hiding ? "hidden" : "inherit";

                this._._frame = null;

                if ( callback ) callback( this );
            };

        if ( !is( hiding, "boolean" ) ) {
            hiding = computed.visibility !== "hidden";
        }

        // cancel previous frame if it exists
        if ( frameId ) cancelFrame( frameId );

        if ( !node.ownerDocument.documentElement.contains( node ) ) {
            done();
        } else {
            this._._frame = requestFrame( done );
        }

        return this;

}, () => () => RETURN_THIS);