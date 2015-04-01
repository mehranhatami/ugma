import { RETURN_THIS, ERROR_MSG                              } from "../const";
import   EventHandler                                          from "../util/eventhandler";
import { implement, isArray, keys, each, forOwn, is, inArray } from "../helpers";
import { minErr                                              } from "../minErr";

implement({
    // Bind an event to a callback function for one or more events to 
    // the selected elements.
    on: false,
    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: true

}, (method, single) => function(type, selector, args, callback) {

    if ( is(type, "string") ) {
        if ( is(args, "function") ) {
            callback = args;

            if ( is(selector, "string") ) {
                args = null;
            } else {
                args = selector;
                selector = null;
            }
        }

        if ( is(selector, "function") ) {
            callback = selector;
            selector = null;
            args = null;
        }

        if ( !is(callback, "function") ) {
            minErr(method + "()", callback + " is not a function.");
        }

        // http://jsperf.com/string-indexof-vs-split
        var node = this[ 0 ],
            parts,
            namespace,
            types = inArray(type, " ") >= -1 ? type.split(" ") : [type],
            i = types.length,
            handler,
            handlers = this._._events || ( this._._events = [] );

        // Handle space separated event names.
        while (i--) {

            type = types[i];

            parts = type.split( "." );
            type = parts[ 0 ] || null;
            namespace = parts[ 1 ] || null;

            handler = EventHandler(this, type, selector, callback, args, single, namespace);

            node.addEventListener(handler._type || type, handler, !!handler.capturing);

            // store event entry
            handlers.push( handler );
        }

    } else if ( is(type, "object") ) {

        if ( isArray( type ) ) {

            each( type, ( name ) => {
                this[ method ]( name, selector, args, callback);
            });
        } else {
            forOwn(type, (name, value) => {
                this[ method ](name, selector, args, value);
            });
        }
    } else {
        minErr( method + "()", ERROR_MSG[ 7 ] );
    }

    return this;
}, () => RETURN_THIS);