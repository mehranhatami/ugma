import { RETURN_THIS                                         } from "../const";
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

}, ( method, single ) => function( eventType, selector, args, callback ) {

    if ( is( eventType, "string" ) ) {
        if ( is( args, "function" ) ) {
            callback = args;

            if ( is(selector, "string" ) ) {
                args = null;
            } else {
                args = selector;
                selector = null;
            }
        }

        if ( is( selector, "function") ) {
            callback = selector;
            selector = null;
            args = null;
        }

        if ( !is( callback, "function" ) ) {
            minErr( method + "()", callback + " is not a function." );
        }

        // http://jsperf.com/string-indexof-vs-split
        var node = this[ 0 ],
            parts,
            namespace,
            eventTypes = inArray(eventType, " ") >= -1 ? eventType.split(" ") : [ eventType ],
            i = eventTypes.length,
            handler,
            handlers = this._._events || ( this._._events = [] );

            // handle namespace
            parts = eventType.split( "." );
            eventType = parts[ 0 ] || null;
            namespace = parts[ 1 ] || null;

            handler = EventHandler(this, eventType, selector, callback, args, single, namespace );

            node.addEventListener(handler._eventType || eventType, handler, !!handler.capturing );

            // store event entry
            handlers.push( handler );

    } else if ( is(eventType, "object") ) {

        if ( isArray( eventType ) ) {

            each( eventType, ( name ) => {
                this[ method ]( name, selector, args, callback );
            });
        } else {
            forOwn( eventType, ( name, value ) => {
                this[ method ]( name, selector, args, value );
            });
        }
    } else {
        minErr( method + "()", "The first argument need to be a string" );
    }

    return this;
}, () => RETURN_THIS);