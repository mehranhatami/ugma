import { RETURN_THIS, ERROR_MSG   } from "../const";
import { ugma                     } from "../core";
import { implement, is, filter    } from "../helpers";
import { minErr                   } from "../minErr";

implement({

    // Remove one or many callbacks.
    off(eventType, selector, callback) {
        if ( !is(eventType,"string" ) ) minErr("off()", ERROR_MSG[ 7 ] );

        if (callback === void 0) {
            callback = selector;
            selector = void 0;
        }

        var self = this,
            node = this[0],
            parts,
            namespace,
            handlers,
            removeHandler = ( handler ) => {

                // Cancel previous frame if it exists
                if ( self._._raf ) {
                    ugma.cancelFrame( self._._raf );
                    // Zero out rAF id used during the animation
                    self._._raf = null;
                }
                // Remove the listener
                node.removeEventListener( ( handler._eventType || handler.eventType ), handler, !!handler.capturing );
            };

        parts = eventType.split( "." );
        eventType = parts[ 0 ] || null;
        namespace = parts[ 1 ] || null;

        this._._events = filter(this._._events, (handler) => {

            var skip = eventType !== handler.eventType;

            skip = skip || selector && selector !== handler.selector;
            skip = skip || namespace && namespace !== handler.namespace;
            skip = skip || callback && callback !== handler.callback;

            // Bail out if listener isn't listening.
            if (skip) return true;

            removeHandler(handler);
        });

        return this;
    }
}, null, () => RETURN_THIS);