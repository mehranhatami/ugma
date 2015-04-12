/**
 * @module showHide
 */

import { implement                   } from "../core/core";
import { RETURN_THIS                 } from "../const";
import { is, computeStyle            } from "../helpers";
import { minErr                      } from "../minErr";
import { requestFrame, cancelFrame   } from "../util/raf";

implement({
    /**
     * Calculate element's width in pixels, or set the width of 
     * the element to the given size, regardless of box model,
     * border, padding, etc.
     * @param {String|Number} size The pixel width  to size to
     * @return {Number} element width in pixels
     * @example
     *
     *    <div id="rectangle" style="font-size: 10px; width: 20em; height: 10em"></div>
     *
     *   ugma.query('#rectangle').width();
     *      // -> 200
     *
     *   ugma.query('#rectangle').width(230);
     *      // -> 230
     */

    width: "offsetWidth",
    /**
     * Calculate element's height in pixels, or set the height of 
     * the element to the given size, regardless of box model,
     * border, padding, etc.
     * @param {String|Number} size The pixel height to size to
     * @return {Number} element height in pixels
     * @example
     *
     *    <div id="rectangle" style="font-size: 10px; width: 20em; height: 10em"></div>
     *
     *   ugma.query('#rectangle').height();
     *      // -> 100
     *
     *   ugma.query('#rectangle').height(130);
     *      // -> 130
     */

    height: "offsetHeight",

}, (methodName, propertyName) => function(value) {

//   if( !is( value, "string" ) || !is( value, "number" ) ) minErr(methodName + "()", "This operation is not supported.");

    var node = this[ 0 ], 
        size = 0;

    value = (value > 0 ) ? value : 0;

    node.style[ propertyName ] = value + "px";
    size = (propertyName === "height") ? node[ propertyName ] : node[ propertyName ];

    if ( size > value ) {
        value = value - ( size - value );

        if ( value < 0 ) {
            value = 0;
        }

        node.style[ propertyName ] = value + "px";
    }

   return this.offset()[ methodName ];

}, () => () => RETURN_THIS );