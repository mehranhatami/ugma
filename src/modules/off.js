import { RETURN_THIS, ERROR_MSG, ugma } from "../const";
import { implement, is, filter } from "../helpers";
import { minErr } from "../minErr";

implement({

    // Remove an event handler, or all event listeners if no
    // arguments
    off(type, selector, callback) {
        if (typeof type !== "string") minErr("off()", ERROR_MSG[7]);

        if (callback === void 0) {
            callback = selector;
            selector = void 0;
        }

        var self = this,
            node = this[0],
            removeHandler = (handler) => {

                // Cancel previous frame if it exists
                if (self._._raf) {
                    ugma.cancelFrame(self._._raf);
                    // Zero out rAF id used during the animation
                    self._._raf = null;
                }
                // Remove the listener
                node.removeEventListener((handler._type || handler.type), handler, !!handler.capturing);
            };

        this._._events = filter(this._._events, (handler) => {

            if (type !== handler.type ||
                selector && selector !== handler.selector ||
                callback && callback !== handler.callback) {
                return true;
            }
            removeHandler(handler);
        });

        return this;
    }
}, null, () => RETURN_THIS);