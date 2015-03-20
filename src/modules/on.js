import { RETURN_THIS, ERROR_MSG } from "../const";
import EventHandler from "../util/eventhandler";
import { implement, isArray, keys, each, forOwn, is } from "../helpers";
import { minErr } from "../minErr";

implement({
    // Attach an event handler function for one or more events to 
    // the selected elements.
    on: false,
    // Attach a handler to an event for the elements. The handler
    // is executed at most once per element per event type.
    once: true

}, (method, single) => function(type, selector, args, callback) {

    var listeners = this._["<%= prop('handler') %>"] || (this._["<%= prop('handler') %>"] = []);

    if (is(type, "string")) {
        if (is(args, "function")) {
            callback = args;

            if (is(selector, "string")) {
                args = null;
            } else {
                args = selector;
                selector = null;
            }
        }

        if (is(selector, "function")) {
            callback = selector;
            selector = null;
            args = null;
        }

        if (!is(callback, "function")) {
              minErr(method + "()", callback + " is not a function.");
        }

        var node = this[0],
            handler = EventHandler(type, selector, callback, args, this, single);
        node.addEventListener(handler._type || type, handler, !!handler.capturing);

        // store event entry
        listeners.push(handler);
    } else if (is(type, "object")) {

        let self = this;

        if (isArray(type)) {

            each(type, function(name) {
                self[method](name, selector, args, callback);
            });
        } else {
            forOwn(type, function(name, value) {
                self[method](name, selector, args, value);
            });
        }
    } else {
        minErr(method + "()", ERROR_MSG[7]);
    }

    return this;
}, () => RETURN_THIS);