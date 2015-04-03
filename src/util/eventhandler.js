/**
 * @module eventhandler
 */

import { slice, map, is        } from "../helpers";
import { WINDOW                } from "../const";
import { nodeTree              } from "../core/core";
import   SelectorMatcher         from "./selectormatcher";
import   eventhooks              from "./eventhooks";

function getEventProperty(name, e, eventType, node, target, currentTarget) {

    if ( is( name, "number" ) ) {

        var args = e._trigger;

        return args ? args[ name ] : void 0;
    }

    if ( name === "type" )               return eventType;
    if ( name === "defaultPrevented" )   return e.defaultPrevented;
    if ( name === "target" )             return nodeTree( target );
    if ( name === "currentTarget" )      return nodeTree( currentTarget );
    if ( name === "relatedTarget" )      return nodeTree( e.relatedTarget );

    var value = e[ name ];

    if ( is( value, "function" ) ) return () => value.apply( e, arguments );

    return value;
}

function EventHandler( el, eventType, selector, callback, props, once, namespace ) {
    var node = el[ 0 ],
        hook = eventhooks[ eventType ],
        matcher = SelectorMatcher( selector, node ),
        handler = ( e ) => {
            e = e || WINDOW.event;
            // early stop in case of default action
            if ( EventHandler.skip === eventType ) return;
            var eventTarget = e.target || node.ownerDocument.documentElement;
            // Safari 6.0+ may fire events on text nodes (Node.TEXT_NODE is 3).
            // @see http://www.quirksmode.org/js/events_properties.html
            eventTarget = eventTarget.nodeType === 3 ? eventTarget.parentNode : eventTarget;
            // Test whether delegated events match the provided `selector` (filter),
            // if this is a event delegation, else use current DOM node as the `currentTarget`.
            var currentTarget = matcher &&
                // Don't process clicks on disabled elements
                ( eventTarget.disabled !== true || e.type !== "click" ) ? matcher( eventTarget ) : node,
                args = props || [];

            // early stop for late binding or when target doesn't match selector
            if ( !currentTarget ) return;

            // off callback even if it throws an exception later
            if ( once ) el.off( eventType, callback );

            if ( props ) {
                args = map( args, ( name ) => getEventProperty(
                    name, e, eventType, node, eventTarget, currentTarget ) );
            } else {
                args = slice.call( e._trigger || [ 0 ], 1 );
            }

            // prevent default if handler returns false
            if ( callback.apply( el, args ) === false ) {
                e.preventDefault();
            }
        };

    if ( hook ) handler = hook( handler, el ) || handler;

    handler.eventType  = eventType;
    handler.namespace  = namespace;
    handler.callback   = callback;
    handler.selector   = selector;

    return handler;
}

export default EventHandler;