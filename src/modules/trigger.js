import { CUSTOM_EVENT_TYPE, RETURN_TRUE, ERROR_MSG      } from "../const";
import   EventHandler from "../util/eventhandler";
import   eventhooks from "../util/eventhooks";
import { implement, invoke, is                          } from "../helpers";
import { minErr                                         } from "../minErr";

implement({
    // Trigger one or many events, firing all bound callbacks. 
    trigger(type) {
    var node = this[ 0 ],
        e, eventType, canContinue;

    if ( is(type, "string") ) {
        let hook = eventhooks[ type ],
            handler = {};

        if ( hook ) handler = hook( handler ) || handler;

        eventType = handler._type || type;
    } else {
        minErr("fire()", ERROR_MSG[ 1] );
    }
    // Handles triggering the appropriate event callbacks.
    e = node.ownerDocument.createEvent("HTMLEvents");
    e[ "__" + "<%= pkg.codename %>" + "__" ] = arguments;
    e.initEvent( eventType, true, true );
    canContinue = node.dispatchEvent( e );

    // call native function to trigger default behavior
    if (canContinue && node[ type ]) {
        // prevent re-triggering of the current event
        EventHandler.skip = type;

        invoke( node, type );

        EventHandler.skip = null;
    }

    return canContinue;
}
}, null, () => RETURN_TRUE);
