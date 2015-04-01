import { ERROR_MSG } from "./const";

export function minErr(module, msg) {
    // NOTE! The 'es6transpiller' will convert 'this' to '$this0' if we try to
    // use the arrow method here. And the function will fail BIG TIME !!
    var wrapper = function() {
        this.message = module ? ( msg ? msg : ERROR_MSG[ 4 ] ) +
            ( module.length > 4 ? " -> Module: " + module : " -> Core " ) : ERROR_MSG[ 1 ];
        // use the name on the framework
        this.name = "ugma";
    };
    wrapper.prototype = Object.create( Error.prototype );
    throw new wrapper( module, msg );
}