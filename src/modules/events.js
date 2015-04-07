/**
 * @module events
 */

import { RETURN_THIS, RETURN_TRUE                                   } from "../const";
import   EventHandler                                                 from "../util/eventhandler";
import   eventhooks                                                   from "../util/eventhooks";
import { implement                                                  } from "../core/core";
import { isArray, keys, each, forOwn, is, inArray, filter, invoke   } from "../helpers";
import { minErr                                                     } from "../minErr";
import { cancelFrame                                                } from "../util/raf";

implement({
    
   /**
    * Bind an event to a callback function for one or more events to the selected elements. 
    * @param  {String|Array}  type        event type(s) with optional selector
    * @param  {String}        [selector]  event selector filter
    * @param  {Array}         [args]      array of handler arguments to pass into the callback
    * @param  {Function}      callback    event callback
    * @chainable
    * @example
    *    
    *      ugma.query("#foo").on("click", function() {
    *        // ...
    *      });
    *    
    *      ugma.query("#foo").on(['click', 'focus'], '.item', function() {
    *        // ...
    *      });
    *    
    *      ugma.query("#foo").on("click", "a.comment", function() {
    *        // ...
    *      });
    *    
    *      ugma.query("#foo").on("click", ['target', 'keyCode'], function(target, keyCode) {
    *        // ...
    *      });
    */
    on: false,
   /**
    * Bind an event to only be triggered a single time. 
    * @param  {String|Array}    type event type(s) with optional selector
    * @param  {Function|String} callback event callback or property name (for late binding)
    * @param  {Array}           [props] array of event properties to pass into the callback
    */
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

        if ( is( selector, "function" ) ) {
            callback = selector;
            selector = null;
            args = null;
        }

        if ( !is( callback, "function" ) )  minErr( method + "()", callback + " is not a function." );

        // http://jsperf.com/string-indexof-vs-split
        var node = this[ 0 ],
            parts,
            eventTypes = inArray( eventType, " " ) >= -1 ? eventType.split( " " ) : [ eventType ],
            i = eventTypes.length,
            handler,
            handlers = this._.handlers || ( this._.handlers = [] );

            handler = EventHandler( this, eventType, selector, callback, args, single );

            node.addEventListener( handler._eventType || eventType, handler, !!handler.capturing );

              // store the event handler
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


implement({

   /**
    * Remove one or many callbacks.
    * @param  {String}          type        type of event
    * @param  {String}          [selector]  event selector
    * @param  {Function|String} [callback] event handler
    * @chainable
    * @example
    *    
    *      ugma.query("#foo").off();
    *    
    *      ugma.query("#foo").off("click", function() {
    *        // ...
    *      });
    */
    off( eventType, selector, callback ) {
        if ( !is( eventType,"string" ) ) minErr("off()", "The first argument need to be a string" );

        if ( callback === void 0 ) {
            callback = selector;
            selector = void 0;
        }

        var self = this,
            node = this[ 0 ],
            parts,
            handlers,
            removeHandler = ( handler ) => {

                // Cancel previous frame if it exists
                if ( self._._raf ) {
                      cancelFrame( self._.raf );
                    // Zero out rAF id used during the animation
                    self._._raf = null;
                }
                // Remove the listener
                node.removeEventListener( ( handler._eventType || handler.eventType ), handler, !!handler.capturing );
            };

        this._.handlers = filter(this._.handlers, ( handler ) => {

            var skip = eventType !== handler.eventType;

            skip = skip || selector && selector !== handler.selector;
            skip = skip || callback && callback !== handler.callback;

            // Bail out if listener isn't listening.
            if ( skip ) return true;

            removeHandler( handler );
        });

        return this;
    }
}, null, () => RETURN_THIS );

implement({
   
   /**
    * Trigger one or many events, firing all bound callbacks. 
    * @param  {String}  type  type of event
    * @param  {...Object}     [args]  extra arguments to pass into each event handler
    * @return {Boolean} true if default action wasn't prevented
    * @chainable
    * @example
    *    link.fire('anyEventType');
    */
    fire( type ) {
    var node = this[ 0 ],
        e, eventType, canContinue;

    if ( is( type, "string" ) ) {
        let hook = eventhooks[ type ],
            handler = {};

        if ( hook ) handler = hook( handler ) || handler;

        eventType = handler._eventType || type;
    } else {
        minErr( "fire()", "The string did not match the expected pattern" );
    }
    // Handles triggering the appropriate event callbacks.
    e = node.ownerDocument.createEvent( "HTMLEvents" );
    e._fire = arguments;
    e.initEvent( eventType, true, true );
    canContinue = node.dispatchEvent( e );

    // call native function to trigger default behavior
    if ( canContinue && node[ type ] ) {
        // prevent re-triggering of the current event
        EventHandler.veto = type;

        invoke( node, type );

        EventHandler.veto = null;
    }

    return canContinue;
  }
}, null, () => RETURN_TRUE );
