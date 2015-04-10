/**
 * @module offset
 */

import { implement  } from "../core/core";
import { WINDOW, DOCUMENT, RETURN_FALSE     } from "../const";


implement({
   /**
    * Calculates position of the current element
    * @return object with left and top properties
    * @example
    *     link.position();
    */
   position(other) {

           var node = this[ 0 ],
               docElem = node.ownerDocument.documentElement,
               offsetParent, offset,
               scrollTop = WINDOW.pageYOffset || docElem.scrollTop,
               scrollLeft = WINDOW.pageXOffset || docElem.scrollLeft,
               parentOffset = {
                   top: 0,
                   left: 0
               };

           // Fixed elements are offset from window (parentOffset = {top:0, left: 0},
           // because it is its only offset parent
           if ( this.css( "position" ) === "fixed" ) {
               // Assume getBoundingClientRect is there when computed position is fixed
               offset = node.getBoundingClientRect();

           } else {
               // Get *real* offsetParent
               offsetParent = this.offsetParent();

               // Get correct offsets
               offset = this.offset();
               if ( offsetParent[ 0 ].nodename !== "HTML" ) {
                   parentOffset = offsetParent.offset();
               }

               // Add offsetParent borders
               parentOffset.top += parseFloat( offsetParent.css( "borderTopWidth" ) );
               parentOffset.left += parseFloat( offsetParent.css( "borderLeftWidth" ) );

               parentOffset.top -= parseFloat( offsetParent[ 0 ].scrollTop );
               parentOffset.left -= parseFloat( offsetParent[ 0 ].scrollLeft );
           }

           // Subtract parent offsets and element margins
           return {
               top: offset.top - parentOffset.top - parseFloat( this.css( "marginTop" ) ),
               left: offset.left - parentOffset.left - parseFloat( this.css( "marginLeft" ) )
           };
       }

 }, null, () =>  () => { return { top: 0, left: 0 }; } );

