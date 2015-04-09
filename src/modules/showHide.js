/**
 * @module visibility
 */

import { ugma, implement             } from "../core/core";
import { RETURN_THIS                 } from "../const";
import { is, computeStyle            } from "../helpers";
import { minErr                      } from "../minErr";
import { requestFrame, cancelFrame   } from "../util/raf";

implement({
    /**
     * Show an element
     * @param {Function} [callback]
     * @chainable
     * @example
     *     
     *  Show a single element:
     *     
     *    link.show(); // displays element
     *
     *    foo.show(function() { });
     *
     *  Show multiple elements using 'native' Array.prototype.forEach:
     *  
     *    ugma.queryAll('.foo').forEach(function(node) { node.show(); ); }  // 'this' keyword can also be used
     *  
     *  Show single element using callback:
     *  
     *    foo.show(function() { query(#.bar").hide()   });
     */
    show: false,
    /**
     * Hide an element
     * @param {Function} [callback]
     * @chainable
     * @example
     *     
     *  Show a single element:
     *     
     *    link.hide(); // hide element
     *
     *  Hide multiple elements using 'native' Array.prototype.forEach:
     *  
     *    ugma.queryAll('.foo').forEach(function(node) { node.hide(); ); } // 'this' keyword can also be used
     *  
     *  Hide single element using callback:
     *  
     *    foo.hide(function() { query(#.bar").show()   });
     */
    hide: true,

    /**
     * Toggle an element
     * @param {Boolean}  
     * @param {Function} [callback]
     * @chainable
     * @example
     * link.toggle(); // toggles element visibility
     *
     * link.toggle(true); // forces 'true' state
     *
     * link.toggle(false); // forces 'false' state
     *
     * foo.toggle(function() { });
     */
    toggle: null

}, ( methodName, condition ) => function( state, callback ) {

    if ( !is( state, "string" ) ) {

        // Boolean toggle()
        if ( methodName === "toggle" && is( state, "boolean" ) ) condition = state;

            callback = state;
            state = null;
    }
    
    if ( callback && !is( callback, "function" ) ) minErr( methodName + "()", "This operation is not supported" );

    var node = this[ 0 ],
        style = node.style,
        computed = computeStyle( node ),
        isHidden = condition,
        frameId = this._.frame,
        done = () => {
            this.set( "aria-hidden", String( isHidden ) );

            style.visibility = isHidden ? "hidden" : "inherit";

            this._.frame = null;

            if ( callback ) callback( this );
        };

    if ( !is( isHidden, "boolean" ) ) isHidden = computed.visibility !== "hidden";

    // cancel previous frame if it exists
    if ( frameId ) cancelFrame( frameId );
    
    // detached nodes
    if ( !node.ownerDocument.documentElement.contains( node ) ) {
        done();
    } else {
        this._.frame = requestFrame( done );
    }

    return this;

}, () => () => RETURN_THIS );