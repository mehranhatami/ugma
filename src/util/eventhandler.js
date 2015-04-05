/**
 * @module eventHandler
 */

import { slice, map, is        } from "../helpers";
import { WINDOW                } from "../const";
import { nodeTree              } from "../core/core";
import   SelectorMatcher         from "./selectormatcher";
import   eventhooks              from "./eventhooks";

var getEventProperty = (name, e, eventType, node, target, currentTarget) => {

    if ( is( name, "number" ) )  return e._fire ? e._fire[ name ] : void 0;
    
    switch( name ) {
     case "type":              return eventType;
     case "target":            return nodeTree( target );
     case "currentTarget":     return nodeTree( currentTarget );
     case "relatedTarget":     return nodeTree( e.relatedTarget );  
    }

    var value = e[ name ];

    if ( is( value, "function" ) ) return () => value.apply( e, arguments );

    return value;
},
 EventHandler = ( el, eventType, selector, callback, props, once ) => {

    var node = el[ 0 ],
        hook = eventhooks[ eventType ],
        matcher = SelectorMatcher( selector, node ),
        handler = ( e ) => {
           
            e = e || WINDOW.event;
            
            // early stop in case of default action
            if ( EventHandler.veto === eventType ) return;
            
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
                args = map( args, ( name ) => getEventProperty( name, e, eventType, node, eventTarget, currentTarget ) );
            } else {
                args = slice.call( e._fire || [ 0 ], 1 );
            }

            // prevent default if handler returns false
            if ( callback.apply( el, args ) === false ) {
                e.preventDefault();
            }
        };

    if ( hook ) handler = hook( handler, el ) || handler;

    handler.eventType  = eventType;
    handler.callback   = callback;
    handler.selector   = selector;

    return handler;
};

/*
 * Export interface
 */

export default EventHandler;