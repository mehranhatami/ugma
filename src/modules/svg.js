/**
 * @module svg
 */

import { implement                                     } from "../core/core";
import { isArray, computeStyle, is, map, forOwn, each  } from "../helpers";
import { minErr                                        } from "../minErr";
import { DOCUMENT                                      } from "../const";
import   styleHooks                                      from "../util/styleHooks";

 implement({
     svg( name, attributes, style ) {

      // Create the SVG element in memory
      
//      ugma.render('svg').set(attributes).css(style);
  
    var svg = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg");    
      
      


         return this;
     }
 });