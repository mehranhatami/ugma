/**
 * @module has
 */
import { implement     } from "../core/core";
import { is            } from "../helpers";
import { minErr        } from "../minErr";
import { RETURN_FALSE  } from "../const";

implement({
  /**
   * Returns true if the requested attribute/property is specified on the given element, and false otherwise.
   * @param  {String} [name] property/attribute name or array of names
   * @return {Boolean} true if exist
   * @chainable
   * @example
   *
   *   <a id='test' href='#'>set-test</a><input id='set_input'/><input id='set_input1'/><form id='form' action='formaction'>
   *
   *      ugma.query("#test").has("checked");
   *      // false
   *
   *      ugma.query("#test").set("checked", "checked");
   *
   *      ugma.query("#test").has("checked");
   *      // true
   */
   has(name) {
        if ( !is( name, "string" ) ) minErr( "has()", "Not a valid property/attribute" );
        
        return !!this[ 0 ][ name ] || this[ 0 ].hasAttribute( name ); // Boolean
    }
}, null, () => RETURN_FALSE );